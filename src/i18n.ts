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
      style: 'Style',
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
    eyebrow: 'Zegar Czarodziejów',
    defaultTitle: 'Czarodziejski Zegar',
    emptyConfig: 'Karta wymaga poprawnej konfiguracji miejsc i osób.',
    tracked: (count) => `${count} śledzonych`,
    alert: (count) => `${count} alarm`,
    allWatched: 'wszyscy obserwowani',
    openWizard: (name) => `Otwórz ${name}`,
    debugMatchedNone: 'brak',
    debugFields: {
      entity: 'encja',
      state: 'stan',
      zone: 'strefa',
      friendlyZone: 'nazwaStrefy',
      locality: 'lokalizacja',
      speed: 'prędkość',
      moving: 'ruch',
      proximity: 'proximity',
      matchedBy: 'dopasowanie',
    },
    labels: {
      title: 'Tytuł',
      subtitle: 'Podtytuł',
      default_place: 'Miejsce domyślne',
      style: 'Wygląd',
      preset: 'Preset',
      ha_theme: 'Motyw Home Assistanta',
      accent_color: 'Kolor akcentu',
      background: 'Tło',
      text_color: 'Kolor tekstu',
      inner_glow: 'Wewnętrzna poświata',
      danger_glow: 'Poświata alarmu',
      show_legend: 'Pokaż legendę',
      show_center_panel: 'Pokaż panel centralny',
      show_place_sectors: 'Pokaż sektory miejsc',
      show_ornaments: 'Pokaż ornamenty',
      debug: 'Tryb debug',
      sector_opacity: 'Przezroczystość sektorów',
      places: 'Miejsca',
      wizards: 'Czarodzieje',
      id: 'ID',
      label: 'Etykieta',
      short_label: 'Krótka etykieta',
      kind: 'Typ',
      priority: 'Priorytet',
      color: 'Kolor',
      label_color: 'Kolor etykiety',
      icon: 'Ikona',
      zone_entities: 'Encje stref',
      match: 'Reguły dopasowania',
      states: 'Stany',
      zones: 'Strefy',
      localities: 'Lokalizacje',
      min_speed: 'Min prędkość',
      max_speed: 'Max prędkość',
      moving: 'W ruchu',
      proximity_directions: 'Kierunki proximity',
      unavailable: 'Niedostępne',
      unknown: 'Nieznane',
      not_home: 'Poza domem',
      entities: 'Warunki encji',
      entity: 'Encja',
      name: 'Nazwa',
      ring_color: 'Kolor obwódki',
      avatar: 'URL avatara',
      show_avatar: 'Użyj entity picture',
      proximity_entity: 'Encja proximity',
      attribute: 'Atrybut',
      state: 'Stan',
      above: 'Powyżej',
      below: 'Poniżej',
    },
    helpers: {
      title: 'Główny tytuł karty widoczny nad zegarem.',
      subtitle: 'Dodatkowy podpis pod tytułem, na przykład dom lub lokalizacja.',
      default_place: 'ID miejsca zapasowego, gdy żadna reguła nie pasuje.',
      preset: 'Gotowy styl tarczy i oprawy karty.',
      ha_theme: 'Opcjonalny motyw Home Assistanta dla tej karty.',
      accent_color: 'Kolor akcentu dla ramek, ornamentów i detali.',
      background: 'Własne tło karty zamiast tła z presetu.',
      text_color: 'Własny kolor tekstu w karcie.',
      inner_glow: 'Włącza delikatną poświatę wewnątrz tarczy.',
      danger_glow: 'Włącza alarmową poświatę dla miejsc typu alert.',
      show_legend: 'Pokazuje legendę z czarodziejami i ich aktualnym miejscem.',
      show_center_panel: 'Pokazuje środkowy medalion z podsumowaniem stanu.',
      show_place_sectors: 'Pokazuje delikatne sektory miejsc na tarczy.',
      show_ornaments: 'Pokazuje dekoracyjne detale na rancie tarczy.',
      debug: 'Pokazuje surowy stan i szczegóły dopasowania pod kartą.',
      sector_opacity: 'Steruje widocznością sektorów, gdy są włączone.',
      places: 'Zdefiniuj miejsca na tarczy i sposoby ich dopasowania.',
      label: 'Pełna nazwa miejsca widoczna w konfiguratorze i legendzie.',
      zone_entities: 'Łatwiejsza opcja: wybierz encje stref zamiast wpisywać nazwy ręcznie.',
      short_label: 'Opcjonalna krótsza nazwa używana na tarczy, gdy główna etykieta jest za długa. Lista w edytorze nadal pokazuje pełną nazwę.',
      kind: 'Typ miejsca. Alert służy do alarmów, fallback do stanu zapasowego.',
      priority: 'Wyżej ustawione miejsce wygrywa, gdy pasuje kilka reguł naraz.',
      color: 'Kolor miejsca lub czarodzieja.',
      label_color: 'Kolor napisu miejsca na tarczy.',
      icon: 'Opcjonalna ikona zarezerwowana pod przyszłe widoki.',
      wizards: 'Śledzeni czarodzieje, trackery lub kalendarze pokazywane jako wskazówki.',
      match: 'Pola lokalizacji są alternatywami. Pola ruchu i statusu są dodatkowymi warunkami.',
      states: 'Dopasuj po stanie encji, np. home albo work.',
      zones: 'Dopasuj po nazwie strefy lub nazwie raportowanej przez encję.',
      localities: 'Dopasuj po locality lub city, jeśli HA zwraca taką informację.',
      min_speed: 'Minimalna prędkość potrzebna, by miejsce zostało uznane za dopasowane.',
      max_speed: 'Maksymalna prędkość dopasowania.',
      moving: 'Wymaga, aby encja była w ruchu lub raportowała prędkość.',
      proximity_directions: 'Dodatkowy warunek dla kierunku proximity.',
      unavailable: 'Dopasuj tylko, gdy encja jest unavailable.',
      unknown: 'Dopasuj tylko, gdy encja ma stan `unknown`.',
      not_home: 'Dopasuj tylko, gdy encja jest poza domem.',
      avatar: 'Opcjonalny URL obrazka zamiast entity_picture.',
      show_avatar: 'Jeśli włączone, używa entity_picture gdy jest dostępne.',
      proximity_entity: 'Opcjonalny sensor lub encja proximity do wykrywania ruchu.',
      entities: 'Opcjonalne dodatkowe warunki, które też muszą pasować.',
      entity: 'Encja czarodzieja lub warunku dodatkowego.',
      name: 'Nazwa wyświetlana na wskazówce i w legendzie.',
      ring_color: 'Kolor obwódki wokół wskazówki lub avatara.',
      attribute: 'Atrybut encji warunku, jeśli nie chcesz sprawdzać samego stanu.',
      state: 'Wymagany stan dla dodatkowego warunku.',
      above: 'Warunek liczbowy: wartość musi być większa.',
      below: 'Warunek liczbowy: wartość musi być mniejsza.',
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
