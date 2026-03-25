export type HassEntity = {
  entity_id: string;
  state: string;
  attributes?: Record<string, any>;
};

export type HomeAssistant = {
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
    language?: string;
  };
  locale?: {
    language?: string;
  };
  language?: string;
  callService?: (domain: string, service: string, data?: Record<string, any>) => void;
};

export type MatchEntityCondition = {
  entity: string;
  attribute?: string;
  state?: string;
  states?: string[];
  above?: number;
  below?: number;
};

export type PlaceMatch = {
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

export type PlaceConfig = {
  id: string;
  label: string;
  short_label?: string;
  kind?: 'place' | 'transient' | 'alert' | 'fallback';
  priority?: number;
  color?: string;
  label_color?: string;
  icon?: string;
  zone_entities?: string[];
  match?: PlaceMatch;
};

export type WizardConfig = {
  entity: string;
  name?: string;
  color?: string;
  text_color?: string;
  ring_color?: string;
  avatar?: string;
  show_avatar?: boolean;
  proximity_entity?: string;
};

export type CardConfig = {
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
    dial_text_color?: string;
    dial_muted_text_color?: string;
    hand_text_color?: string;
    inner_glow?: boolean;
    danger_glow?: boolean;
    show_legend?: boolean;
    show_center_panel?: boolean;
    show_place_sectors?: boolean;
    sector_opacity?: number;
    show_ornaments?: boolean;
    debug?: boolean;
  };
};

export type WizardContext = {
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

export type ResolvedWizard = {
  name: string;
  initials: string;
  color: string;
  textColor: string;
  ringColor: string;
  entityId: string;
  place: PlaceConfig;
  angle: number;
  placeIndex: number;
  avatar?: string;
  entity?: HassEntity;
  debug?: WizardContext & {
    matchedBy: string[];
  };
};

export type ValidationIssue = {
  path: string;
  message: string;
  severity: 'error' | 'warning';
};
