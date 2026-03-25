import type { HomeAssistant } from './types';

export type LocaleKey =
  | 'en'
  | 'pl';

type Dictionary = {
  eyebrow: string;
  defaultTitle: string;
  emptyConfig: string;
  tracked: (count: number) => string;
  alert: (count: number) => string;
  allWatched: string;
  openWizard: (name: string) => string;
  debugMatchedNone: string;
  debugFields: Record<string, string>;
  labels: Record<string, string>;
  helpers: Record<string, string>;
};

const dictionaries: Record<LocaleKey, Dictionary> = {
  en: {
    eyebrow: 'Wizard Presence',
    defaultTitle: 'Wizard Clock',
    emptyConfig: 'The card requires a valid places and wizards configuration.',
    tracked: (count) => `${count} tracked`,
    alert: (count) => `${count} alert`,
    allWatched: 'all watched',
    openWizard: (name) => `Open ${name}`,
    debugMatchedNone: 'none',
    debugFields: {
      entity: 'entity',
      state: 'state',
      zone: 'zone',
      friendlyZone: 'friendlyZone',
      locality: 'locality',
      speed: 'speed',
      moving: 'moving',
      proximity: 'proximity',
      matchedBy: 'matchedBy',
    },
    labels: {
      title: 'Title',
      subtitle: 'Subtitle',
      default_place: 'Default place',
      preset: 'Preset',
      ha_theme: 'Home Assistant theme',
      accent_color: 'Accent color',
      background: 'Background',
      text_color: 'Text color',
      inner_glow: 'Inner glow',
      danger_glow: 'Danger glow',
      show_legend: 'Show legend',
      show_center_panel: 'Show center panel',
      show_place_sectors: 'Show place sectors',
      show_ornaments: 'Show ornaments',
      debug: 'Debug mode',
      sector_opacity: 'Sector opacity',
      places: 'Places',
      wizards: 'Wizards',
      id: 'ID',
      label: 'Label',
      short_label: 'Short label',
      kind: 'Kind',
      priority: 'Priority',
      color: 'Color',
      label_color: 'Label color',
      icon: 'Icon',
      zone_entities: 'Zone entities',
      match: 'Match rules',
      states: 'States',
      zones: 'Zones',
      localities: 'Localities',
      min_speed: 'Min speed',
      max_speed: 'Max speed',
      moving: 'Moving',
      proximity_directions: 'Proximity directions',
      unavailable: 'Unavailable',
      unknown: 'Unknown',
      not_home: 'Not home',
      entities: 'Entity conditions',
      entity: 'Entity',
      name: 'Name',
      ring_color: 'Ring color',
      avatar: 'Avatar URL',
      show_avatar: 'Use entity picture',
      proximity_entity: 'Proximity entity',
      attribute: 'Attribute',
      state: 'State',
      above: 'Above',
      below: 'Below',
    },
    helpers: {
      default_place: 'Fallback place ID used when no matching rule is found.',
      show_place_sectors: 'Shows subtle colored sectors behind place labels on the dial.',
      show_ornaments: 'Shows decorative rim details around the clock face.',
      debug: 'Shows raw state and matching details below the card.',
      sector_opacity: 'Controls how visible the sectors are when enabled.',
      places: 'Define locations shown around the dial and how they match entity states.',
      zone_entities: 'Easy mode: pick one or more zone entities instead of typing zone names manually.',
      short_label: 'Optional shorter name used on the dial when the main label is too long. The editor list still shows the full label.',
      wizards: 'Tracked people, device trackers or calendars shown as clock hands.',
      match: 'Location fields are alternatives. Movement and status fields act as extra requirements.',
      avatar: 'Optional image URL used instead of entity_picture.',
      show_avatar: 'If enabled, uses entity_picture when available.',
      proximity_entity: 'Optional sensor or proximity entity used to detect motion direction.',
      entities: 'Optional extra conditions that must also match.',
    },
  },
  pl: {
    eyebrow: 'Obecnosc Czarodziejow',
    defaultTitle: 'Czarodziejski Zegar',
    emptyConfig: 'Karta wymaga poprawnej konfiguracji miejsc i osob.',
    tracked: (count) => `${count} sledzonych`,
    alert: (count) => `${count} alarm`,
    allWatched: 'wszyscy obserwowani',
    openWizard: (name) => `Otworz ${name}`,
    debugMatchedNone: 'brak',
    debugFields: {
      entity: 'encja',
      state: 'stan',
      zone: 'strefa',
      friendlyZone: 'nazwaStrefy',
      locality: 'lokalizacja',
      speed: 'predkosc',
      moving: 'ruch',
      proximity: 'proximity',
      matchedBy: 'dopasowanie',
    },
    labels: {
      title: 'Tytul',
      subtitle: 'Podtytul',
      default_place: 'Miejsce domyslne',
      preset: 'Preset',
      ha_theme: 'Motyw Home Assistanta',
      accent_color: 'Kolor akcentu',
      background: 'Tlo',
      text_color: 'Kolor tekstu',
      inner_glow: 'Wewnetrzna poswiata',
      danger_glow: 'Poswiata alarmu',
      show_legend: 'Pokaz legende',
      show_center_panel: 'Pokaz panel centralny',
      show_place_sectors: 'Pokaz sektory miejsc',
      show_ornaments: 'Pokaz ornamenty',
      debug: 'Tryb debug',
      sector_opacity: 'Przezroczystosc sektorow',
      places: 'Miejsca',
      wizards: 'Osoby',
      id: 'ID',
      label: 'Etykieta',
      short_label: 'Krotka etykieta',
      kind: 'Typ',
      priority: 'Priorytet',
      color: 'Kolor',
      label_color: 'Kolor etykiety',
      icon: 'Ikona',
      zone_entities: 'Encje stref',
      match: 'Reguly dopasowania',
      states: 'Stany',
      zones: 'Strefy',
      localities: 'Lokalizacje',
      min_speed: 'Min predkosc',
      max_speed: 'Max predkosc',
      moving: 'W ruchu',
      proximity_directions: 'Kierunki proximity',
      unavailable: 'Niedostepne',
      unknown: 'Nieznane',
      not_home: 'Poza domem',
      entities: 'Warunki encji',
      entity: 'Encja',
      name: 'Nazwa',
      ring_color: 'Kolor obwodki',
      avatar: 'URL avatara',
      show_avatar: 'Uzyj entity picture',
      proximity_entity: 'Encja proximity',
      attribute: 'Atrybut',
      state: 'Stan',
      above: 'Powyzej',
      below: 'Ponizej',
    },
    helpers: {
      default_place: 'ID miejsca zapasowego, gdy zadna regula nie pasuje.',
      show_place_sectors: 'Pokazuje delikatne sektory miejsc na tarczy.',
      show_ornaments: 'Pokazuje dekoracyjne detale na rancie tarczy.',
      debug: 'Pokazuje surowy stan i szczegoly dopasowania pod karta.',
      sector_opacity: 'Steruje widocznoscia sektorow, gdy sa wlaczone.',
      places: 'Zdefiniuj miejsca na tarczy i sposoby ich dopasowania.',
      zone_entities: 'Latwiejsza opcja: wybierz encje stref zamiast wpisywac nazwy recznie.',
      short_label: 'Opcjonalna krotsza nazwa uzywana na tarczy, gdy glowna etykieta jest za dluga. Lista w edytorze nadal pokazuje pelna nazwe.',
      wizards: 'Sledzone osoby, trackery lub kalendarze pokazywane jako wskazowki.',
      match: 'Pola lokalizacji sa alternatywami. Pola ruchu i statusu sa dodatkowymi warunkami.',
      avatar: 'Opcjonalny URL obrazka zamiast entity_picture.',
      show_avatar: 'Jesli wlaczone, uzywa entity_picture gdy jest dostepne.',
      proximity_entity: 'Opcjonalny sensor lub encja proximity do wykrywania ruchu.',
      entities: 'Opcjonalne dodatkowe warunki, ktore tez musza pasowac.',
    },
  },
};

export function normalizeLanguage(language?: string | null): LocaleKey {
  const normalized = String(language || '').toLowerCase();
  if (normalized.startsWith('pl')) {
    return 'pl';
  }

  return 'en';
}

export function getHassLanguage(hass?: HomeAssistant): LocaleKey {
  return normalizeLanguage(
    hass?.language
    || hass?.locale?.language
    || hass?.config?.language
    || (typeof navigator !== 'undefined' ? navigator.language : 'en'),
  );
}

export function getBrowserLanguage(): LocaleKey {
  return normalizeLanguage(typeof navigator !== 'undefined' ? navigator.language : 'en');
}

export function getEditorLanguage(): LocaleKey {
  const documentLanguage = typeof document !== 'undefined'
    ? document.documentElement?.lang
    : '';
  const hassLanguage = typeof document !== 'undefined'
    ? (document.querySelector('home-assistant') as any)?.hass?.language
      || (document.querySelector('hc-main') as any)?.hass?.language
    : '';
  const browserLanguages = typeof navigator !== 'undefined'
    ? navigator.languages?.find(Boolean)
    : '';

  return normalizeLanguage(
    hassLanguage
    || documentLanguage
    || browserLanguages
    || (typeof navigator !== 'undefined' ? navigator.language : 'en'),
  );
}

export function getTranslations(language: LocaleKey): Dictionary {
  return dictionaries[language] || dictionaries.en;
}
