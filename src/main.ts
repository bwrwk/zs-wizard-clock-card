import { LitElement, css, html, svg } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import {
  asArray,
  deriveWizardContext,
  explainPlaceMatch,
  getZoneMatchValues,
  matchesPlace,
  normalize,
  normalizeList,
  validateConfig,
} from './core';
import { getEditorLanguage, getHassLanguage, getTranslations } from './i18n';
import type { CardConfig, HomeAssistant, PlaceConfig, ResolvedWizard, WizardConfig } from './types';

declare global {
  interface Window {
    customCards?: Array<Record<string, any>>;
  }
}

const CARD_TAG = 'zs-wizard-clock-card';

const DEFAULT_CONFIG: CardConfig = {
  type: `custom:${CARD_TAG}`,
  title: 'Wizard Clock',
  subtitle: '',
  default_place: '',
  places: [],
  wizards: [],
  style: {
    preset: 'brass',
    ha_theme: '',
    accent_color: '',
    background: '',
    text_color: '',
    inner_glow: true,
    danger_glow: true,
    show_legend: true,
    show_center_panel: true,
    show_place_sectors: true,
    sector_opacity: 0.16,
    show_ornaments: true,
    debug: false,
  },
};

const PRESET_STYLES = {
  brass: {
    background: 'radial-gradient(circle at 50% 35%, rgba(255,244,216,0.98), rgba(209,182,130,0.96) 58%, rgba(98,67,33,0.96) 100%)',
    cardBackground: 'linear-gradient(180deg, rgba(76, 52, 28, 0.94), rgba(30, 20, 12, 0.98))',
    text: '#f8ecd2',
    muted: 'rgba(248, 236, 210, 0.74)',
    dialText: '#5a3b19',
    dialMuted: 'rgba(90, 59, 25, 0.72)',
    rim: '#3c2412',
    accent: '#d9b36e',
    face: '#efe1c3',
    faceShadow: 'rgba(69, 39, 15, 0.34)',
    center: '#5f3516',
  },
  parchment: {
    background: 'radial-gradient(circle at 50% 35%, rgba(253,245,225,0.98), rgba(235,223,190,0.96) 62%, rgba(174,147,92,0.92) 100%)',
    cardBackground: 'linear-gradient(180deg, rgba(113, 89, 51, 0.92), rgba(53, 38, 20, 0.97))',
    text: '#2d2417',
    muted: 'rgba(45, 36, 23, 0.62)',
    dialText: '#503e22',
    dialMuted: 'rgba(80, 62, 34, 0.74)',
    rim: '#715933',
    accent: '#b7873a',
    face: '#f5ebd2',
    faceShadow: 'rgba(105, 78, 35, 0.2)',
    center: '#6b4a21',
  },
  ministry: {
    background: 'radial-gradient(circle at 50% 35%, rgba(231,241,242,0.98), rgba(125,161,153,0.94) 60%, rgba(25,53,58,0.98) 100%)',
    cardBackground: 'linear-gradient(180deg, rgba(14, 43, 47, 0.96), rgba(8, 23, 26, 0.99))',
    text: '#ebf6f4',
    muted: 'rgba(235, 246, 244, 0.74)',
    dialText: '#20484b',
    dialMuted: 'rgba(32, 72, 75, 0.72)',
    rim: '#0f3034',
    accent: '#6dc3b6',
    face: '#d7ebe5',
    faceShadow: 'rgba(7, 27, 28, 0.28)',
    center: '#1d4d54',
  },
};

function mergeConfig(config: CardConfig): CardConfig {
  return {
    ...DEFAULT_CONFIG,
    ...config,
    style: {
      ...DEFAULT_CONFIG.style,
      ...(config.style || {}),
    },
    places: config.places || [],
    wizards: config.wizards || [],
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function polarX(angle: number, radius: number): number {
  return 50 + Math.cos(angle - Math.PI / 2) * radius;
}

function polarY(angle: number, radius: number): number {
  return 50 + Math.sin(angle - Math.PI / 2) * radius;
}

function buildArcPath(angle: number, radius: number, span = 0.56): string {
  const startAngle = angle - span / 2;
  const endAngle = angle + span / 2;
  const startX = polarX(startAngle, radius);
  const startY = polarY(startAngle, radius);
  const endX = polarX(endAngle, radius);
  const endY = polarY(endAngle, radius);
  const largeArc = span > Math.PI ? 1 : 0;
  return `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArc} 1 ${endX} ${endY}`;
}

function buildRingSlicePath(angle: number, innerRadius: number, outerRadius: number, width: number): string {
  const startAngle = angle - width / 2;
  const endAngle = angle + width / 2;
  const outerStartX = polarX(startAngle, outerRadius);
  const outerStartY = polarY(startAngle, outerRadius);
  const outerEndX = polarX(endAngle, outerRadius);
  const outerEndY = polarY(endAngle, outerRadius);
  const innerEndX = polarX(endAngle, innerRadius);
  const innerEndY = polarY(endAngle, innerRadius);
  const innerStartX = polarX(startAngle, innerRadius);
  const innerStartY = polarY(startAngle, innerRadius);
  const largeArc = width > Math.PI ? 1 : 0;

  return [
    `M ${outerStartX} ${outerStartY}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${outerEndX} ${outerEndY}`,
    `L ${innerEndX} ${innerEndY}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${innerStartX} ${innerStartY}`,
    'Z',
  ].join(' ');
}

function computeInitials(name: string): string {
  const parts = name.split(' ').filter(Boolean).slice(0, 2);
  if (!parts.length) {
    return '?';
  }

  return parts.map((part) => part[0]?.toUpperCase() || '').join('');
}

function colorWithAlpha(color: string, alpha: number): string {
  if (color.startsWith('rgb(')) {
    return color.replace('rgb(', 'rgba(').replace(')', `, ${alpha})`);
  }

  if (color.startsWith('rgba(')) {
    return color.replace(/,\s*[\d.]+\)$/, `, ${alpha})`);
  }

  if (color.startsWith('#') && (color.length === 7 || color.length === 4)) {
    const normalized = color.length === 4
      ? `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`
      : color;
    const hexAlpha = Math.round(clamp(alpha, 0, 1) * 255).toString(16).padStart(2, '0');
    return `${normalized}${hexAlpha}`;
  }

  return color;
}

function getPlaceDialLabel(place: PlaceConfig): string {
  return place.short_label || place.label;
}

function getPlaceLabelFontSize(place: PlaceConfig): string {
  const label = getPlaceDialLabel(place);
  const length = Array.from(label).length;

  if (length >= 26) {
    return '1.7px';
  }

  if (length >= 20) {
    return '2.05px';
  }

  if (length >= 15) {
    return '2.45px';
  }

  return '3.1px';
}


class ZSWizardClockCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    config: { attribute: false },
  };

  static getStubConfig() {
    const editorLanguage = getEditorLanguage();
    const t = getTranslations(editorLanguage);
    return {
      type: `custom:${CARD_TAG}`,
      title: t.defaultTitle,
      subtitle: 'The Burrow',
      default_place: 'unknown',
      style: {
        preset: 'brass',
        show_place_sectors: false,
        show_center_panel: true,
        show_legend: true,
        show_ornaments: true,
        debug: false,
      },
      places: [
        {
          id: 'home',
          label: editorLanguage === 'pl' ? 'W domu' : 'At Home',
          zone_entities: ['zone.home'],
          match: {
            states: ['home'],
            zones: ['home'],
          },
        },
        {
          id: 'travelling',
          label: editorLanguage === 'pl' ? 'W podróży' : 'Travelling',
          kind: 'transient',
          priority: 80,
          match: {
            moving: true,
            min_speed: 8,
            proximity_directions: ['towards', 'away_from'],
          },
        },
        {
          id: 'unknown',
          label: editorLanguage === 'pl' ? 'Nieznane' : 'Unknown',
          kind: 'fallback',
        },
      ],
      wizards: [
        {
          entity: 'person.example',
          name: 'Harry',
        },
      ],
    };
  }

  static getConfigForm() {
    const t = getTranslations(getEditorLanguage());
    return {
      schema: [
        { name: 'title', selector: { text: {} } },
        { name: 'subtitle', selector: { text: {} } },
        { name: 'default_place', selector: { text: {} } },
        {
          type: 'expandable',
          name: 'style',
          title: t.labels.style || 'Style',
          schema: [
            {
              name: 'preset',
              selector: {
                select: {
                  options: [
                    { value: 'brass', label: 'Brass' },
                    { value: 'parchment', label: 'Parchment' },
                    { value: 'ministry', label: 'Ministry' },
                  ],
                },
              },
            },
            { name: 'ha_theme', selector: { theme: {} } },
            { name: 'accent_color', selector: { text: {} } },
            { name: 'background', selector: { text: {} } },
            { name: 'text_color', selector: { text: {} } },
            { name: 'dial_text_color', selector: { text: {} } },
            { name: 'dial_muted_text_color', selector: { text: {} } },
            { name: 'hand_text_color', selector: { text: {} } },
            { name: 'inner_glow', selector: { boolean: {} } },
            { name: 'danger_glow', selector: { boolean: {} } },
            { name: 'show_legend', selector: { boolean: {} } },
            { name: 'show_center_panel', selector: { boolean: {} } },
            { name: 'show_place_sectors', selector: { boolean: {} } },
            { name: 'show_ornaments', selector: { boolean: {} } },
            { name: 'debug', selector: { boolean: {} } },
            {
              name: 'sector_opacity',
              selector: {
                number: {
                  min: 0,
                  max: 1,
                  step: 0.05,
                  mode: 'slider',
                },
              },
            },
          ],
        },
        {
          name: 'places',
          selector: {
            object: {
              multiple: true,
              label_field: 'label',
              description_field: 'id',
              fields: {
                id: { required: true, selector: { text: {} } },
                label: { required: true, selector: { text: {} } },
                short_label: { selector: { text: {} } },
                kind: {
                  selector: {
                    select: {
                      options: [
                        { value: 'place', label: 'Place' },
                        { value: 'transient', label: 'Transient' },
                        { value: 'alert', label: 'Alert' },
                        { value: 'fallback', label: 'Fallback' },
                      ],
                    },
                  },
                },
                priority: {
                  selector: {
                    number: { min: 0, max: 100, step: 1, mode: 'box' },
                  },
                },
                color: { selector: { text: {} } },
                label_color: { selector: { text: {} } },
                icon: { selector: { icon: {} } },
                zone_entities: {
                  selector: {
                    entity: {
                      multiple: true,
                      filter: [
                        { domain: 'zone' },
                      ],
                    },
                  },
                },
                match: {
                  selector: {
                    object: {
                      fields: {
                        states: { selector: { text: { multiple: true } } },
                        zones: { selector: { text: { multiple: true } } },
                        localities: { selector: { text: { multiple: true } } },
                        min_speed: {
                          selector: {
                            number: { min: 0, max: 300, step: 1, mode: 'box' },
                          },
                        },
                        max_speed: {
                          selector: {
                            number: { min: 0, max: 300, step: 1, mode: 'box' },
                          },
                        },
                        moving: { selector: { boolean: {} } },
                        proximity_directions: {
                          selector: {
                            select: {
                              multiple: true,
                              mode: 'list',
                              options: [
                                { value: 'towards', label: 'towards' },
                                { value: 'away_from', label: 'away_from' },
                                { value: 'stationary', label: 'stationary' },
                              ],
                            },
                          },
                        },
                        unavailable: { selector: { boolean: {} } },
                        unknown: { selector: { boolean: {} } },
                        not_home: { selector: { boolean: {} } },
                        entities: {
                          selector: {
                            object: {
                              multiple: true,
                              label_field: 'entity',
                              description_field: 'attribute',
                              fields: {
                                entity: { required: true, selector: { entity: {} } },
                                attribute: { selector: { text: {} } },
                                state: { selector: { text: {} } },
                                states: { selector: { text: { multiple: true } } },
                                above: {
                                  selector: {
                                    number: { min: -999999, max: 999999, step: 1, mode: 'box' },
                                  },
                                },
                                below: {
                                  selector: {
                                    number: { min: -999999, max: 999999, step: 1, mode: 'box' },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          name: 'wizards',
          selector: {
            object: {
              multiple: true,
              label_field: 'name',
              description_field: 'entity',
              fields: {
                entity: {
                  required: true,
                  selector: {
                    entity: {
                      filter: [
                        { domain: 'person' },
                        { domain: 'device_tracker' },
                        { domain: 'calendar' },
                      ],
                    },
                  },
                },
                name: { selector: { text: {} } },
                color: { selector: { text: {} } },
                text_color: { selector: { text: {} } },
                ring_color: { selector: { text: {} } },
                avatar: { selector: { text: {} } },
                show_avatar: { selector: { boolean: {} } },
                proximity_entity: {
                  selector: {
                    entity: {
                      filter: [
                        { domain: 'sensor' },
                        { domain: 'proximity' },
                      ],
                    },
                  },
                },
              },
            },
          },
        },
      ],
      computeLabel: (schema: { name: string }) => {
        return t.labels[schema.name] || schema.name;
      },
      computeHelper: (schema: { name: string }) => {
        return t.helpers[schema.name];
      },
    };
  }

  hass?: HomeAssistant;
  config!: CardConfig;

  static styles = css`
    :host {
      display: block;
      --zs-clock-card-bg: linear-gradient(180deg, rgba(76, 52, 28, 0.94), rgba(30, 20, 12, 0.98));
      --zs-clock-text: #f8ecd2;
      --zs-clock-muted: rgba(248, 236, 210, 0.74);
      --zs-clock-dial-text: #5a3b19;
      --zs-clock-dial-muted: rgba(90, 59, 25, 0.72);
      --zs-clock-accent: #d9b36e;
      --zs-clock-rim: #3c2412;
      --zs-clock-face: #efe1c3;
      --zs-clock-shadow: rgba(69, 39, 15, 0.34);
      --zs-clock-center: #5f3516;
      --zs-clock-size: min(76vw, 560px);
      --zs-clock-title: "Cinzel", "Cormorant Garamond", Georgia, serif;
      --zs-clock-copy: "Cormorant Garamond", Georgia, serif;
    }

    ha-card {
      position: relative;
      overflow: hidden;
      padding: 24px;
      border-radius: 32px;
      background: var(--zs-clock-card-bg);
      color: var(--zs-clock-text);
      border: 1px solid color-mix(in srgb, var(--zs-clock-accent) 28%, transparent);
      box-shadow:
        0 26px 52px rgba(0, 0, 0, 0.28),
        inset 0 1px 0 rgba(255, 255, 255, 0.08);
    }

    .backdrop {
      position: absolute;
      inset: 0;
      pointer-events: none;
      background:
        radial-gradient(circle at 15% 18%, rgba(255,255,255,0.14), transparent 22%),
        radial-gradient(circle at 80% 12%, rgba(255,220,152,0.15), transparent 20%),
        linear-gradient(135deg, transparent, rgba(255,255,255,0.04), transparent 70%);
      opacity: 0.95;
    }

    .shell {
      position: relative;
      display: grid;
      gap: 20px;
    }

    .header {
      display: grid;
      gap: 6px;
      justify-items: center;
      text-align: center;
    }

    .eyebrow {
      font-family: var(--zs-clock-copy);
      font-size: 0.9rem;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--zs-clock-muted);
    }

    .title {
      font-family: var(--zs-clock-title);
      font-size: clamp(1.8rem, 4vw, 2.7rem);
      letter-spacing: 0.05em;
      text-wrap: balance;
    }

    .subtitle {
      font-family: var(--zs-clock-copy);
      font-size: 1.08rem;
      color: var(--zs-clock-muted);
      text-wrap: balance;
    }

    .clock-wrap {
      display: grid;
      justify-items: center;
    }

    .clock-frame {
      width: var(--zs-clock-size);
      max-width: 100%;
      aspect-ratio: 1;
      filter: drop-shadow(0 24px 30px rgba(0, 0, 0, 0.35));
    }

    svg {
      width: 100%;
      height: 100%;
      display: block;
      overflow: visible;
    }

    .place-label {
      font-family: var(--zs-clock-title);
      letter-spacing: 0.08em;
      fill: var(--zs-clock-dial-text);
      text-transform: uppercase;
    }

    .hand {
      transform-origin: 50px 50px;
      transition: transform 760ms cubic-bezier(0.22, 1, 0.36, 1);
    }

    .hand-label {
      font-family: var(--zs-clock-copy);
      font-size: 3px;
      letter-spacing: 0.04em;
      pointer-events: none;
      paint-order: stroke fill;
      stroke: rgba(49, 28, 12, 0.4);
      stroke-width: 0.6px;
      stroke-linejoin: round;
    }

    .legend {
      display: grid;
      gap: 12px;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    }

    .legend-item {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 12px;
      align-items: center;
      padding: 12px 14px;
      border-radius: 18px;
      background: rgba(255, 248, 230, 0.08);
      border: 1px solid rgba(255, 244, 217, 0.1);
      backdrop-filter: blur(10px);
      color: inherit;
      text-align: left;
      width: 100%;
      font: inherit;
      cursor: pointer;
      transition: transform 180ms ease, background 180ms ease, border-color 180ms ease;
    }

    .legend-item:hover {
      transform: translateY(-1px);
      background: rgba(255, 248, 230, 0.12);
      border-color: rgba(255, 244, 217, 0.18);
    }

    .legend-seal {
      width: 38px;
      height: 38px;
      border-radius: 999px;
      overflow: hidden;
      display: grid;
      place-items: center;
      font-family: var(--zs-clock-title);
      font-size: 0.95rem;
      font-weight: 700;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.24);
    }

    .legend-copy {
      min-width: 0;
      display: grid;
    }

    .legend-name {
      font-family: var(--zs-clock-title);
      font-size: 1.02rem;
      letter-spacing: 0.03em;
    }

    .legend-place {
      font-family: var(--zs-clock-copy);
      font-size: 1rem;
      color: var(--zs-clock-muted);
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .empty {
      font-family: var(--zs-clock-copy);
      color: var(--zs-clock-muted);
      text-align: center;
      padding: 12px 0 4px;
    }

    .debug {
      display: grid;
      gap: 10px;
      padding-top: 4px;
    }

    .debug-item {
      padding: 12px 14px;
      border-radius: 16px;
      background: rgba(0, 0, 0, 0.18);
      border: 1px solid rgba(255, 244, 217, 0.08);
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 0.78rem;
      line-height: 1.45;
      color: var(--zs-clock-muted);
      overflow: auto;
    }

    @media (max-width: 640px) {
      ha-card {
        padding: 18px;
        border-radius: 24px;
      }

      .legend {
        grid-template-columns: 1fr;
      }
    }
  `;

  setConfig(config: CardConfig) {
    const mergedConfig = mergeConfig(config);
    const issues = validateConfig(mergedConfig);
    const errors = issues.filter((issue) => issue.severity === 'error');

    if (errors.length) {
      throw new Error(errors.map((issue) => `${issue.path}: ${issue.message}`).join(' '));
    }

    this.config = mergedConfig;
  }

  getCardSize() {
    return 8;
  }

  getGridOptions() {
    return {
      columns: 12,
      min_columns: 6,
      rows: 8,
      min_rows: 6,
    };
  }

  get isDarkMode(): boolean {
    return Boolean(this.hass?.themes?.darkMode);
  }

  get t() {
    return getTranslations(getHassLanguage(this.hass));
  }

  get selectedPreset() {
    return PRESET_STYLES[this.config.style?.preset || 'brass'] || PRESET_STYLES.brass;
  }

  get selectedThemeVariables(): Record<string, string> {
    const themeName = this.config.style?.ha_theme;
    if (!themeName) {
      return {};
    }

    return { ...(this.hass?.themes?.themes?.[themeName] || {}) };
  }

  get orderedPlaces(): PlaceConfig[] {
    return [...this.config.places].sort((left, right) => {
      const priorityDelta = Number(right.priority || 0) - Number(left.priority || 0);
      return priorityDelta || this.config.places.indexOf(left) - this.config.places.indexOf(right);
    });
  }

  get fallbackTextColor(): string {
    return this.config.style?.text_color || this.selectedPreset.text;
  }

  get dialTextColor(): string {
    return this.config.style?.dial_text_color || this.selectedPreset.dialText;
  }

  get dialMutedTextColor(): string {
    return this.config.style?.dial_muted_text_color || this.selectedPreset.dialMuted;
  }

  get handTextColor(): string {
    return this.config.style?.hand_text_color || '#fff8ed';
  }

  get summaryPlace(): PlaceConfig | undefined {
    const alerts = this.resolvedWizards.filter((wizard) => wizard.place.kind === 'alert');
    if (alerts.length) {
      return alerts[0].place;
    }

    const transient = this.resolvedWizards.filter((wizard) => wizard.place.kind === 'transient');
    if (transient.length) {
      return transient[0].place;
    }

    return this.resolvedWizards[0]?.place;
  }

  get alertCount(): number {
    return this.resolvedWizards.filter((wizard) => wizard.place.kind === 'alert').length;
  }

  resolvePlaceForWizard(wizard: WizardConfig): PlaceConfig {
    const entity = this.hass?.states?.[wizard.entity];
    const proximityEntity = wizard.proximity_entity ? this.hass?.states?.[wizard.proximity_entity] : undefined;
    const context = deriveWizardContext(entity, proximityEntity);
    const matched = this.orderedPlaces.find((place) => matchesPlace(place, context, this.hass as HomeAssistant));

    if (matched) {
      return matched;
    }

    if (normalize(context.state) === 'home') {
      const homeLikePlace = this.config.places.find((place) => {
        const zones = normalizeList(place.match?.zones);
        const states = normalizeList(place.match?.states);
        const zoneEntities = getZoneMatchValues(place, this.hass as HomeAssistant);
        return normalize(place.id) === 'home'
          || states.includes('home')
          || zones.includes('home')
          || zoneEntities.includes('home');
      });

      if (homeLikePlace) {
        return homeLikePlace;
      }
    }

    if (this.config.default_place) {
      const configuredDefault = this.config.places.find((place) => place.id === this.config.default_place);
      if (configuredDefault) {
        return configuredDefault;
      }
    }

    return this.config.places[this.config.places.length - 1];
  }

  get resolvedWizards(): ResolvedWizard[] {
    const places = this.config.places;

    return this.config.wizards.map((wizard, index) => {
      const entity = this.hass?.states?.[wizard.entity];
      const proximityEntity = wizard.proximity_entity ? this.hass?.states?.[wizard.proximity_entity] : undefined;
      const context = deriveWizardContext(entity, proximityEntity);
      const place = this.resolvePlaceForWizard(wizard);
      const placeIndex = Math.max(0, places.findIndex((item) => item.id === place.id));
      const angle = (Math.PI * 2 * placeIndex) / Math.max(places.length, 1);
      const name = wizard.name || entity?.attributes?.friendly_name || wizard.entity;

      return {
        name,
        initials: computeInitials(name),
        color: wizard.color || `hsl(${(index * 83 + 12) % 360} 52% 38%)`,
        textColor: wizard.text_color || this.handTextColor,
        ringColor: wizard.ring_color || 'rgba(255, 248, 230, 0.42)',
        entityId: wizard.entity,
        place,
        angle,
        placeIndex,
        avatar: wizard.avatar || (wizard.show_avatar === false ? '' : entity?.attributes?.entity_picture || ''),
        entity,
        debug: {
          ...context,
          matchedBy: explainPlaceMatch(place, context, this.hass as HomeAssistant),
        },
      };
    });
  }

  getRotationForWizard(wizard: ResolvedWizard): number {
    const group = this.resolvedWizards.filter((item) => item.placeIndex === wizard.placeIndex);
    const groupIndex = group.findIndex((item) => item.entityId === wizard.entityId);
    const spread = group.length > 1 ? ((groupIndex - (group.length - 1) / 2) / group.length) * 18 : 0;
    return (wizard.angle * 180) / Math.PI + spread;
  }

  openMoreInfo(entityId: string) {
    const event = new Event('hass-more-info', { bubbles: true, composed: true }) as Event & {
      detail?: { entityId: string };
    };
    event.detail = { entityId };
    this.dispatchEvent(event);
  }

  computeCardStyle() {
    const preset = this.selectedPreset;
    return {
      ...this.selectedThemeVariables,
      '--zs-clock-card-bg': this.config.style?.background || preset.cardBackground,
      '--zs-clock-text': this.config.style?.text_color || preset.text,
      '--zs-clock-muted': preset.muted,
      '--zs-clock-dial-text': this.config.style?.dial_text_color || preset.dialText,
      '--zs-clock-dial-muted': this.config.style?.dial_muted_text_color || preset.dialMuted,
      '--zs-clock-accent': this.config.style?.accent_color || preset.accent,
      '--zs-clock-rim': preset.rim,
      '--zs-clock-face': preset.face,
      '--zs-clock-shadow': preset.faceShadow,
      '--zs-clock-center': preset.center,
    };
  }

  renderDial() {
    const places = this.config.places;
    const resolved = this.resolvedWizards;
    const placeStep = (Math.PI * 2) / Math.max(places.length, 1);
    const supportsDangerGlow = this.config.style?.danger_glow !== false
      && resolved.some((wizard) => wizard.place.kind === 'alert');

    return svg`
      <svg viewBox="0 0 100 100" role="img" aria-label=${this.config.title || 'Wizard clock'}>
        <defs>
          <radialGradient id="faceGradient" cx="50%" cy="34%" r="70%">
            <stop offset="0%" stop-color=${this.selectedPreset.background.includes('rgba') ? '#fff7e7' : '#fff7e7'}></stop>
            <stop offset="68%" stop-color="var(--zs-clock-face)"></stop>
            <stop offset="100%" stop-color=${this.selectedPreset.rim}></stop>
          </radialGradient>
          <filter id="innerGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.2" result="blur"></feGaussianBlur>
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 0.35 0"
              result="shadow"
            ></feColorMatrix>
            <feMerge>
              <feMergeNode in="shadow"></feMergeNode>
              <feMergeNode in="SourceGraphic"></feMergeNode>
            </feMerge>
          </filter>
          <filter id="dangerGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3.4" result="coloredBlur"></feGaussianBlur>
            <feFlood flood-color="#c2361d" flood-opacity="0.42"></feFlood>
            <feComposite in2="coloredBlur" operator="in"></feComposite>
            <feMerge>
              <feMergeNode></feMergeNode>
              <feMergeNode in="SourceGraphic"></feMergeNode>
            </feMerge>
          </filter>
          ${places.map((place, index) => {
            const angle = placeStep * index;
            return svg`<path id="place-arc-${index}" d=${buildArcPath(angle, 39)} fill="none"></path>`;
          })}
        </defs>

        <circle
          cx="50"
          cy="50"
          r="47"
          fill="none"
          stroke="var(--zs-clock-rim)"
          stroke-width="2.8"
        ></circle>
        <circle
          cx="50"
          cy="50"
          r="44.6"
          fill="none"
          stroke="color-mix(in srgb, var(--zs-clock-accent) 72%, white)"
          stroke-width="0.9"
          opacity="0.88"
        ></circle>
        ${this.config.style?.show_ornaments === false ? '' : svg`
          ${places.map((_, index) => {
            const angle = placeStep * index;
            const ornamentX = polarX(angle, 43.15);
            const ornamentY = polarY(angle, 43.15);
            return svg`
              <circle
                cx=${ornamentX}
                cy=${ornamentY}
                r="0.72"
                fill="color-mix(in srgb, var(--zs-clock-accent) 75%, white)"
                opacity="0.95"
              ></circle>
            `;
          })}
          ${[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle) => {
            const starX = polarX(angle, 45.6);
            const starY = polarY(angle, 45.6);
            return svg`
              <g transform="translate(${starX} ${starY}) rotate(${(angle * 180) / Math.PI})">
                <path
                  d="M 0 -1.6 L 0.42 -0.42 L 1.6 0 L 0.42 0.42 L 0 1.6 L -0.42 0.42 L -1.6 0 L -0.42 -0.42 Z"
                  fill="color-mix(in srgb, var(--zs-clock-accent) 82%, white)"
                  opacity="0.88"
                ></path>
              </g>
            `;
          })}
        `}
        <circle
          cx="50"
          cy="50"
          r="41.6"
          fill="url(#faceGradient)"
          filter=${this.config.style?.inner_glow === false ? 'none' : 'url(#innerGlow)'}
        ></circle>

        ${this.config.style?.show_place_sectors === false ? '' : places.map((place, index) => {
          const angle = placeStep * index;
          const sectorColor = colorWithAlpha(place.color || 'var(--zs-clock-accent)', Number(this.config.style?.sector_opacity ?? 0.16));
          return svg`
            <path
              d=${buildRingSlicePath(angle, 22.5, 39.8, Math.max(placeStep - 0.1, 0.28))}
              fill=${sectorColor}
              opacity=${place.kind === 'alert' ? '0.8' : '1'}
            ></path>
          `;
        })}

        ${supportsDangerGlow ? svg`
          <circle
            cx="50"
            cy="50"
            r="40.2"
            fill="none"
            stroke="rgba(194, 54, 29, 0.45)"
            stroke-width="0.8"
            filter="url(#dangerGlow)"
          ></circle>
        ` : ''}

        ${places.map((place, index) => {
          const angle = placeStep * index;
          const tickInnerX = polarX(angle, 31.2);
          const tickInnerY = polarY(angle, 31.2);
          const tickOuterX = polarX(angle, 38.1);
          const tickOuterY = polarY(angle, 38.1);

          return svg`
            <line
              x1=${tickInnerX}
              y1=${tickInnerY}
              x2=${tickOuterX}
              y2=${tickOuterY}
              stroke="color-mix(in srgb, var(--zs-clock-rim) 60%, transparent)"
              stroke-width="0.5"
            ></line>
            <text
              class="place-label"
              fill=${place.label_color || 'var(--zs-clock-dial-text)'}
              font-size=${getPlaceLabelFontSize(place)}
              lengthAdjust="spacingAndGlyphs"
            >
              <textPath
                href="#place-arc-${index}"
                startOffset="50%"
                text-anchor="middle"
                textLength="18"
                lengthAdjust="spacingAndGlyphs"
              >
                ${getPlaceDialLabel(place)}
              </textPath>
            </text>
          `;
        })}

        ${resolved.map((wizard, index) => this.renderHand(wizard, index))}

        ${this.config.style?.show_center_panel === false ? '' : svg`
          <g>
            <circle cx="50" cy="50" r="13.4" fill="rgba(34, 20, 9, 0.16)"></circle>
            <circle
              cx="50"
              cy="50"
              r="12.4"
              fill="rgba(255, 251, 243, 0.16)"
              stroke="color-mix(in srgb, var(--zs-clock-accent) 52%, white)"
              stroke-width="0.35"
            ></circle>
          </g>
          <g>
            <text
              x="50"
              y="71.5"
              text-anchor="middle"
              font-family="var(--zs-clock-title)"
              font-size="2.45"
              fill="var(--zs-clock-dial-text)"
            >
              ${this.summaryPlace?.short_label || this.summaryPlace?.label || this.t.defaultTitle}
            </text>
            <text
              x="50"
              y="75.2"
              text-anchor="middle"
              font-family="var(--zs-clock-copy)"
              font-size="1.85"
              fill="var(--zs-clock-dial-muted)"
            >
              ${this.t.tracked(this.resolvedWizards.length)}
            </text>
            <text
              x="50"
              y="78.3"
              text-anchor="middle"
              font-family="var(--zs-clock-copy)"
              font-size="1.7"
              fill=${this.alertCount ? '#b33a27' : 'var(--zs-clock-dial-muted)'}
            >
              ${this.alertCount ? this.t.alert(this.alertCount) : this.t.allWatched}
            </text>
          </g>
        `}

        <circle cx="50" cy="50" r="5.1" fill="var(--zs-clock-rim)"></circle>
        <circle cx="50" cy="50" r="3.4" fill="var(--zs-clock-center)"></circle>
        <circle cx="50" cy="50" r="1.2" fill="color-mix(in srgb, var(--zs-clock-accent) 68%, white)"></circle>
      </svg>
    `;
  }

  renderHand(wizard: ResolvedWizard, index: number) {
    const rotation = this.getRotationForWizard(wizard);
    const tipY = 18;
    const labelRotation = rotation > 180 ? 180 : 0;

    return svg`
      <g
        class="hand"
        style=${styleMap({ transform: `rotate(${rotation}deg)` })}
        @click=${() => this.openMoreInfo(wizard.entityId)}
      >
        <path
          d="M 50 50 C 52.6 46.4, 54.2 37.2, 53.5 27.5 C 53 21.7, 51.6 18.8, 50 14.2 C 48.4 18.8, 47 21.7, 46.5 27.5 C 45.8 37.2, 47.4 46.4, 50 50 Z"
          fill=${wizard.color}
          stroke=${wizard.ringColor}
          stroke-width="0.35"
        ></path>
        <circle cx="50" cy=${tipY} r="4.3" fill=${wizard.color} stroke=${wizard.ringColor} stroke-width="0.55"></circle>
        ${wizard.avatar ? svg`
          <clipPath id="avatar-clip-${index}">
            <circle cx="50" cy=${tipY} r="3.55"></circle>
          </clipPath>
          <image
            href=${wizard.avatar}
            x="46.35"
            y=${tipY - 3.65}
            width="7.3"
            height="7.3"
            preserveAspectRatio="xMidYMid slice"
            clip-path="url(#avatar-clip-${index})"
          ></image>
        ` : svg`
          <text
            x="50"
            y=${tipY + 1.1}
            fill=${wizard.textColor}
            font-family="var(--zs-clock-title)"
            font-size="2.65"
            text-anchor="middle"
            dominant-baseline="middle"
          >
            ${wizard.initials}
          </text>
        `}
        <g transform="translate(50 34) rotate(${labelRotation})">
          <text
            class="hand-label"
            text-anchor="middle"
            dominant-baseline="middle"
            fill=${wizard.textColor}
          >
            ${wizard.name}
          </text>
        </g>
      </g>
    `;
  }

  renderLegend() {
    if (this.config.style?.show_legend === false) {
      return '';
    }

    return html`
      <div class="legend">
        ${this.resolvedWizards.map((wizard) => html`
          <button
            class="legend-item"
            @click=${() => this.openMoreInfo(wizard.entityId)}
            title=${this.t.openWizard(wizard.name)}
          >
            <div
              class="legend-seal"
              style=${styleMap({
                background: wizard.color,
                color: wizard.textColor,
                border: `1px solid ${wizard.ringColor}`,
              })}
            >
              ${wizard.avatar ? html`<img src=${wizard.avatar} alt=${wizard.name} style="width:100%;height:100%;object-fit:cover;border-radius:inherit;" />` : wizard.initials}
            </div>
            <div class="legend-copy">
              <div class="legend-name">${wizard.name}</div>
              <div class="legend-place">${wizard.place.label}</div>
            </div>
          </button>
        `)}
      </div>
    `;
  }

  renderDebug() {
    if (this.config.style?.debug !== true) {
      return '';
    }

    return html`
      <div class="debug">
        ${this.resolvedWizards.map((wizard) => html`
          <div class="debug-item">
            <div><strong>${wizard.name}</strong> -> ${wizard.place.label}</div>
            <div>${this.t.debugFields.entity}: ${wizard.entityId}</div>
            <div>${this.t.debugFields.state}: ${wizard.debug?.state || '-'}</div>
            <div>${this.t.debugFields.zone}: ${wizard.debug?.zone || '-'}</div>
            <div>${this.t.debugFields.friendlyZone}: ${wizard.debug?.friendlyZone || '-'}</div>
            <div>${this.t.debugFields.locality}: ${wizard.debug?.locality || '-'}</div>
            <div>${this.t.debugFields.speed}: ${wizard.debug?.speed ?? '-'}</div>
            <div>${this.t.debugFields.moving}: ${String(wizard.debug?.moving ?? false)}</div>
            <div>${this.t.debugFields.proximity}: ${wizard.debug?.proximity || '-'}</div>
            <div>${this.t.debugFields.matchedBy}: ${wizard.debug?.matchedBy?.length ? wizard.debug.matchedBy.join(', ') : this.t.debugMatchedNone}</div>
          </div>
        `)}
      </div>
    `;
  }

  renderEmpty() {
    return html`
      <ha-card>
        <div class="shell">
          <div class="empty">${this.t.emptyConfig}</div>
        </div>
      </ha-card>
    `;
  }

  render() {
    if (!this.config) {
      return this.renderEmpty();
    }

    return html`
      <ha-card style=${styleMap(this.computeCardStyle())}>
        <div class="backdrop"></div>
        <div class="shell">
          <div class="header">
            <div class="eyebrow">${this.t.eyebrow}</div>
            <div class="title">${this.config.title || this.t.defaultTitle}</div>
            ${this.config.subtitle ? html`<div class="subtitle">${this.config.subtitle}</div>` : ''}
          </div>
          <div class="clock-wrap">
            <div class="clock-frame">${this.renderDial()}</div>
          </div>
          ${this.renderLegend()}
          ${this.renderDebug()}
        </div>
      </ha-card>
    `;
  }
}

customElements.define(CARD_TAG, ZSWizardClockCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: CARD_TAG,
  name: 'ZS Wizard Clock Card',
  preview: true,
  description: 'Elegant magical family location clock for Home Assistant',
  documentationURL: 'https://github.com/bwrwk/zs-wizard-clock-card',
});
