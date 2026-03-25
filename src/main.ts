import { LitElement, css, html, svg } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

declare global {
  interface Window {
    customCards?: Array<Record<string, any>>;
  }
}

type HassEntity = {
  entity_id: string;
  state: string;
  attributes?: Record<string, any>;
};

type HomeAssistant = {
  states: Record<string, HassEntity>;
  themes?: {
    darkMode?: boolean;
    themes?: Record<string, Record<string, string>>;
  };
  config?: {
    unit_system?: {
      length?: string;
      temperature?: string;
    };
  };
  callService?: (domain: string, service: string, data?: Record<string, any>) => void;
};

type MatchEntityCondition = {
  entity: string;
  attribute?: string;
  state?: string;
  states?: string[];
  above?: number;
  below?: number;
};

type PlaceMatch = {
  states?: string[];
  zones?: string[];
  localities?: string[];
  min_speed?: number;
  max_speed?: number;
  moving?: boolean;
  proximity_directions?: string[];
  unavailable?: boolean;
  unknown?: boolean;
  not_home?: boolean;
  entities?: MatchEntityCondition[];
};

type PlaceConfig = {
  id: string;
  label: string;
  short_label?: string;
  kind?: 'place' | 'transient' | 'alert' | 'fallback';
  priority?: number;
  color?: string;
  label_color?: string;
  icon?: string;
  match?: PlaceMatch;
};

type WizardConfig = {
  entity: string;
  name?: string;
  color?: string;
  text_color?: string;
  ring_color?: string;
  avatar?: string;
  proximity_entity?: string;
};

type CardConfig = {
  type: string;
  title?: string;
  subtitle?: string;
  default_place?: string;
  places: PlaceConfig[];
  wizards: WizardConfig[];
  style?: {
    preset?: 'brass' | 'parchment' | 'ministry';
    ha_theme?: string;
    accent_color?: string;
    background?: string;
    text_color?: string;
    inner_glow?: boolean;
    danger_glow?: boolean;
    show_legend?: boolean;
  };
};

type ResolvedWizard = {
  name: string;
  initials: string;
  color: string;
  textColor: string;
  ringColor: string;
  entityId: string;
  place: PlaceConfig;
  angle: number;
  placeIndex: number;
  entity?: HassEntity;
};

type WizardContext = {
  state: string;
  zone: string;
  locality: string;
  friendlyZone: string;
  speed: number;
  moving: boolean;
  proximity: string;
  unavailable: boolean;
  unknown: boolean;
  notHome: boolean;
};

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
  },
};

const PRESET_STYLES = {
  brass: {
    background: 'radial-gradient(circle at 50% 35%, rgba(255,244,216,0.98), rgba(209,182,130,0.96) 58%, rgba(98,67,33,0.96) 100%)',
    cardBackground: 'linear-gradient(180deg, rgba(76, 52, 28, 0.94), rgba(30, 20, 12, 0.98))',
    text: '#f8ecd2',
    muted: 'rgba(248, 236, 210, 0.74)',
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

function normalize(value: any): string {
  return String(value ?? '').trim().toLowerCase();
}

function asArray<T>(value: T | T[] | undefined): T[] {
  if (value === undefined) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
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

function computeInitials(name: string): string {
  const parts = name.split(' ').filter(Boolean).slice(0, 2);
  if (!parts.length) {
    return '?';
  }

  return parts.map((part) => part[0]?.toUpperCase() || '').join('');
}

function getEntityAttribute(entity: HassEntity | undefined, attribute?: string): any {
  if (!entity) {
    return undefined;
  }

  if (!attribute || attribute === 'state') {
    return entity.state;
  }

  return entity.attributes?.[attribute];
}

function evaluateEntityCondition(condition: MatchEntityCondition, hass: HomeAssistant): boolean {
  const entity = hass.states?.[condition.entity];
  const rawValue = getEntityAttribute(entity, condition.attribute);

  if (condition.state !== undefined) {
    return String(rawValue) === String(condition.state);
  }

  if (condition.states?.length) {
    return condition.states.map(normalize).includes(normalize(rawValue));
  }

  if (condition.above !== undefined) {
    return Number(rawValue) > Number(condition.above);
  }

  if (condition.below !== undefined) {
    return Number(rawValue) < Number(condition.below);
  }

  return !!rawValue;
}

function deriveWizardContext(entity: HassEntity | undefined, proximityEntity: HassEntity | undefined): WizardContext {
  if (!entity) {
    return {
      state: 'unavailable',
      zone: '',
      locality: '',
      friendlyZone: '',
      speed: 0,
      moving: false,
      proximity: '',
      unavailable: true,
      unknown: false,
      notHome: true,
    };
  }

  const state = String(entity.state ?? '');
  const attributes = entity.attributes || {};
  const zone = String(attributes.zone ?? state ?? '');
  const friendlyZone = String(attributes.friendly_name ?? '');
  const locality = String(attributes.locality ?? attributes.city ?? '');
  const speed = Number(attributes.velocity ?? attributes.speed ?? 0);
  const moving = Boolean(attributes.moving) || speed > 0;
  const proximity = String(proximityEntity?.state ?? '');
  const unavailable = ['unavailable'].includes(normalize(state));
  const unknown = ['unknown'].includes(normalize(state));
  const notHome = ['not_home', 'away'].includes(normalize(state));

  return {
    state,
    zone,
    locality,
    friendlyZone,
    speed: Number.isFinite(speed) ? speed : 0,
    moving,
    proximity,
    unavailable,
    unknown,
    notHome,
  };
}

function matchesPlace(place: PlaceConfig, context: WizardContext, hass: HomeAssistant): boolean {
  const match = place.match;
  if (!match) {
    return false;
  }

  const state = normalize(context.state);
  const zone = normalize(context.zone);
  const locality = normalize(context.locality);
  const proximity = normalize(context.proximity);

  const checks: boolean[] = [];

  if (match.states?.length) {
    checks.push(match.states.map(normalize).includes(state));
  }

  if (match.zones?.length) {
    checks.push(match.zones.map(normalize).includes(zone));
  }

  if (match.localities?.length) {
    checks.push(match.localities.map(normalize).includes(locality));
  }

  if (match.min_speed !== undefined) {
    checks.push(context.speed >= Number(match.min_speed));
  }

  if (match.max_speed !== undefined) {
    checks.push(context.speed <= Number(match.max_speed));
  }

  if (match.moving !== undefined) {
    checks.push(context.moving === Boolean(match.moving));
  }

  if (match.proximity_directions?.length) {
    checks.push(match.proximity_directions.map(normalize).includes(proximity));
  }

  if (match.unavailable) {
    checks.push(context.unavailable);
  }

  if (match.unknown) {
    checks.push(context.unknown);
  }

  if (match.not_home) {
    checks.push(context.notHome);
  }

  if (match.entities?.length) {
    checks.push(match.entities.every((condition) => evaluateEntityCondition(condition, hass)));
  }

  return checks.length > 0 && checks.every(Boolean);
}

class ZSWizardClockCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    config: { attribute: false },
  };

  hass?: HomeAssistant;
  config!: CardConfig;

  static styles = css`
    :host {
      display: block;
      --zs-clock-card-bg: linear-gradient(180deg, rgba(76, 52, 28, 0.94), rgba(30, 20, 12, 0.98));
      --zs-clock-text: #f8ecd2;
      --zs-clock-muted: rgba(248, 236, 210, 0.74);
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
      font-size: 3.1px;
      letter-spacing: 0.08em;
      fill: color-mix(in srgb, var(--zs-clock-rim) 80%, black);
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
    }

    .legend-seal {
      width: 38px;
      height: 38px;
      border-radius: 999px;
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
    if (!config?.places?.length) {
      throw new Error('Specify at least one place in `places`.');
    }

    if (!config?.wizards?.length) {
      throw new Error('Specify at least one wizard in `wizards`.');
    }

    this.config = mergeConfig(config);
  }

  getCardSize() {
    return 8;
  }

  get isDarkMode(): boolean {
    return Boolean(this.hass?.themes?.darkMode);
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

  resolvePlaceForWizard(wizard: WizardConfig): PlaceConfig {
    const entity = this.hass?.states?.[wizard.entity];
    const proximityEntity = wizard.proximity_entity ? this.hass?.states?.[wizard.proximity_entity] : undefined;
    const context = deriveWizardContext(entity, proximityEntity);
    const matched = this.orderedPlaces.find((place) => matchesPlace(place, context, this.hass as HomeAssistant));

    if (matched) {
      return matched;
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
      const place = this.resolvePlaceForWizard(wizard);
      const entity = this.hass?.states?.[wizard.entity];
      const placeIndex = Math.max(0, places.findIndex((item) => item.id === place.id));
      const angle = (Math.PI * 2 * placeIndex) / Math.max(places.length, 1);
      const name = wizard.name || entity?.attributes?.friendly_name || wizard.entity;

      return {
        name,
        initials: computeInitials(name),
        color: wizard.color || `hsl(${(index * 83 + 12) % 360} 52% 38%)`,
        textColor: wizard.text_color || '#fff8ed',
        ringColor: wizard.ring_color || 'rgba(255, 248, 230, 0.42)',
        entityId: wizard.entity,
        place,
        angle,
        placeIndex,
        entity,
      };
    });
  }

  computeCardStyle() {
    const preset = this.selectedPreset;
    return {
      ...this.selectedThemeVariables,
      '--zs-clock-card-bg': this.config.style?.background || preset.cardBackground,
      '--zs-clock-text': this.config.style?.text_color || preset.text,
      '--zs-clock-muted': preset.muted,
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
        <circle
          cx="50"
          cy="50"
          r="41.6"
          fill="url(#faceGradient)"
          filter=${this.config.style?.inner_glow === false ? 'none' : 'url(#innerGlow)'}
        ></circle>

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
            <text class="place-label">
              <textPath href="#place-arc-${index}" startOffset="50%" text-anchor="middle">
                ${place.short_label || place.label}
              </textPath>
            </text>
          `;
        })}

        ${resolved.map((wizard, index) => this.renderHand(wizard, index, resolved.length))}

        <circle cx="50" cy="50" r="5.1" fill="var(--zs-clock-rim)"></circle>
        <circle cx="50" cy="50" r="3.4" fill="var(--zs-clock-center)"></circle>
        <circle cx="50" cy="50" r="1.2" fill="color-mix(in srgb, var(--zs-clock-accent) 68%, white)"></circle>
      </svg>
    `;
  }

  renderHand(wizard: ResolvedWizard, index: number, total: number) {
    const spread = total > 1 ? ((index - (total - 1) / 2) / total) * 0.22 : 0;
    const rotation = ((wizard.angle + spread) * 180) / Math.PI;
    const tipY = 18;
    const labelRotation = rotation > 180 ? 180 : 0;

    return svg`
      <g class="hand" style=${styleMap({ transform: `rotate(${rotation}deg)` })}>
        <path
          d="M 50 50 C 52.6 46.4, 54.2 37.2, 53.5 27.5 C 53 21.7, 51.6 18.8, 50 14.2 C 48.4 18.8, 47 21.7, 46.5 27.5 C 45.8 37.2, 47.4 46.4, 50 50 Z"
          fill=${wizard.color}
          stroke=${wizard.ringColor}
          stroke-width="0.35"
        ></path>
        <circle cx="50" cy=${tipY} r="4.3" fill=${wizard.color} stroke=${wizard.ringColor} stroke-width="0.55"></circle>
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
          <div class="legend-item">
            <div
              class="legend-seal"
              style=${styleMap({
                background: wizard.color,
                color: wizard.textColor,
                border: `1px solid ${wizard.ringColor}`,
              })}
            >
              ${wizard.initials}
            </div>
            <div class="legend-copy">
              <div class="legend-name">${wizard.name}</div>
              <div class="legend-place">${wizard.place.label}</div>
            </div>
          </div>
        `)}
      </div>
    `;
  }

  renderEmpty() {
    return html`
      <ha-card>
        <div class="shell">
          <div class="empty">Karta wymaga poprawnej konfiguracji miejsc i osób.</div>
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
            <div class="eyebrow">Wizard Presence</div>
            <div class="title">${this.config.title || 'Wizard Clock'}</div>
            ${this.config.subtitle ? html`<div class="subtitle">${this.config.subtitle}</div>` : ''}
          </div>
          <div class="clock-wrap">
            <div class="clock-frame">${this.renderDial()}</div>
          </div>
          ${this.renderLegend()}
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
