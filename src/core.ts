import type {
  CardConfig,
  HassEntity,
  HomeAssistant,
  MatchEntityCondition,
  PlaceConfig,
  ValidationIssue,
  WizardContext,
} from './types';

export function normalize(value: any): string {
  return String(value ?? '').trim().toLowerCase();
}

export function asArray<T>(value: T | T[] | undefined): T[] {
  if (value === undefined) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

export function normalizeList(value: any): string[] {
  if (value === undefined || value === null || value === '') {
    return [];
  }

  if (Array.isArray(value)) {
    return value.flatMap((entry) => normalizeList(entry)).filter(Boolean);
  }

  if (typeof value === 'string') {
    return value.split(',').map((entry) => normalize(entry)).filter(Boolean);
  }

  if (typeof value === 'object') {
    return Object.values(value).flatMap((entry) => normalizeList(entry)).filter(Boolean);
  }

  return [normalize(value)].filter(Boolean);
}

export function getEntityObjectId(entityId: string): string {
  return String(entityId || '').split('.').slice(1).join('.') || String(entityId || '');
}

export function getEntityAttribute(entity: HassEntity | undefined, attribute?: string): any {
  if (!entity) {
    return undefined;
  }

  if (!attribute || attribute === 'state') {
    return entity.state;
  }

  return entity.attributes?.[attribute];
}

export function getZoneMatchValues(place: PlaceConfig, hass: HomeAssistant): string[] {
  const values = new Set<string>();

  for (const zoneEntityId of asArray(place.zone_entities)) {
    const zoneEntity = hass.states?.[zoneEntityId];
    const objectId = getEntityObjectId(zoneEntityId);

    if (objectId) {
      values.add(normalize(objectId));
    }

    if (zoneEntity?.attributes?.friendly_name) {
      values.add(normalize(zoneEntity.attributes.friendly_name));
    }

    if (zoneEntity?.state) {
      values.add(normalize(zoneEntity.state));
    }
  }

  return [...values];
}

export function evaluateEntityCondition(condition: MatchEntityCondition, hass: HomeAssistant): boolean {
  const entity = hass.states?.[condition.entity];
  const rawValue = getEntityAttribute(entity, condition.attribute);

  if (condition.state !== undefined) {
    return String(rawValue) === String(condition.state);
  }

  if (condition.states?.length) {
    return normalizeList(condition.states).includes(normalize(rawValue));
  }

  if (condition.above !== undefined) {
    return Number(rawValue) > Number(condition.above);
  }

  if (condition.below !== undefined) {
    return Number(rawValue) < Number(condition.below);
  }

  return !!rawValue;
}

export function deriveWizardContext(
  entity: HassEntity | undefined,
  proximityEntity: HassEntity | undefined,
): WizardContext {
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

  return {
    state,
    zone,
    locality,
    friendlyZone,
    speed: Number.isFinite(speed) ? speed : 0,
    moving,
    proximity,
    unavailable: normalize(state) === 'unavailable',
    unknown: normalize(state) === 'unknown',
    notHome: ['not_home', 'away'].includes(normalize(state)),
  };
}

export function matchesPlace(place: PlaceConfig, context: WizardContext, hass: HomeAssistant): boolean {
  const match = place.match || {};
  const state = normalize(context.state);
  const zone = normalize(context.zone);
  const locality = normalize(context.locality);
  const friendlyZone = normalize(context.friendlyZone);
  const proximity = normalize(context.proximity);

  const locationChecks: boolean[] = [];
  const gatingChecks: boolean[] = [];

  if (match.states?.length) {
    locationChecks.push(normalizeList(match.states).includes(state));
  }

  if (match.zones?.length) {
    const configuredZones = normalizeList(match.zones);
    locationChecks.push(
      configuredZones.includes(zone)
      || configuredZones.includes(state)
      || configuredZones.includes(friendlyZone),
    );
  }

  if (asArray(place.zone_entities).length) {
    const zoneMatches = getZoneMatchValues(place, hass);
    locationChecks.push(
      zoneMatches.includes(zone)
      || zoneMatches.includes(state)
      || zoneMatches.includes(friendlyZone),
    );
  }

  if (match.localities?.length) {
    locationChecks.push(normalizeList(match.localities).includes(locality));
  }

  if (match.min_speed !== undefined) {
    gatingChecks.push(context.speed >= Number(match.min_speed));
  }

  if (match.max_speed !== undefined) {
    gatingChecks.push(context.speed <= Number(match.max_speed));
  }

  if (match.moving !== undefined) {
    gatingChecks.push(context.moving === Boolean(match.moving));
  }

  if (match.proximity_directions?.length) {
    gatingChecks.push(normalizeList(match.proximity_directions).includes(proximity));
  }

  if (match.unavailable) {
    gatingChecks.push(context.unavailable);
  }

  if (match.unknown) {
    gatingChecks.push(context.unknown);
  }

  if (match.not_home) {
    gatingChecks.push(context.notHome);
  }

  if (match.entities?.length) {
    gatingChecks.push(match.entities.every((condition) => evaluateEntityCondition(condition, hass)));
  }

  const hasLocationLogic = locationChecks.length > 0;
  const hasGatingLogic = gatingChecks.length > 0;
  const hasAnyLogic = hasLocationLogic || hasGatingLogic;

  return hasAnyLogic
    && (hasLocationLogic ? locationChecks.some(Boolean) : true)
    && (hasGatingLogic ? gatingChecks.every(Boolean) : true);
}

export function explainPlaceMatch(place: PlaceConfig, context: WizardContext, hass: HomeAssistant): string[] {
  const reasons: string[] = [];
  const match = place.match || {};
  const state = normalize(context.state);
  const zone = normalize(context.zone);
  const locality = normalize(context.locality);
  const friendlyZone = normalize(context.friendlyZone);
  const proximity = normalize(context.proximity);

  if (match.states?.length && normalizeList(match.states).includes(state)) {
    reasons.push(`state:${state}`);
  }

  if (match.zones?.length) {
    const configuredZones = normalizeList(match.zones);
    if (configuredZones.includes(zone) || configuredZones.includes(state) || configuredZones.includes(friendlyZone)) {
      reasons.push(`zone:${zone || state || friendlyZone}`);
    }
  }

  if (asArray(place.zone_entities).length) {
    const zoneMatches = getZoneMatchValues(place, hass);
    if (zoneMatches.includes(zone) || zoneMatches.includes(state) || zoneMatches.includes(friendlyZone)) {
      reasons.push(`zone_entity:${zone || state || friendlyZone}`);
    }
  }

  if (match.localities?.length && normalizeList(match.localities).includes(locality)) {
    reasons.push(`locality:${locality}`);
  }

  if (match.min_speed !== undefined && context.speed >= Number(match.min_speed)) {
    reasons.push(`min_speed:${context.speed}`);
  }

  if (match.max_speed !== undefined && context.speed <= Number(match.max_speed)) {
    reasons.push(`max_speed:${context.speed}`);
  }

  if (match.moving !== undefined && context.moving === Boolean(match.moving)) {
    reasons.push(`moving:${context.moving}`);
  }

  if (match.proximity_directions?.length && normalizeList(match.proximity_directions).includes(proximity)) {
    reasons.push(`proximity:${proximity}`);
  }

  if (match.unavailable && context.unavailable) {
    reasons.push('unavailable');
  }

  if (match.unknown && context.unknown) {
    reasons.push('unknown');
  }

  if (match.not_home && context.notHome) {
    reasons.push('not_home');
  }

  if (match.entities?.length && match.entities.every((condition) => evaluateEntityCondition(condition, hass))) {
    reasons.push('entities');
  }

  return reasons;
}

export function validateConfig(config: CardConfig): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const placeIds = new Set<string>();
  const wizardEntities = new Set<string>();

  if (!config.places?.length) {
    issues.push({ path: 'places', message: 'Add at least one place.', severity: 'error' });
  }

  if (!config.wizards?.length) {
    issues.push({ path: 'wizards', message: 'Add at least one wizard.', severity: 'error' });
  }

  for (const [index, place] of (config.places || []).entries()) {
    if (!place.id?.trim()) {
      issues.push({ path: `places[${index}].id`, message: 'Place ID is required.', severity: 'error' });
    } else if (placeIds.has(place.id)) {
      issues.push({ path: `places[${index}].id`, message: `Duplicate place ID "${place.id}".`, severity: 'error' });
    } else {
      placeIds.add(place.id);
    }

    if (!place.label?.trim()) {
      issues.push({ path: `places[${index}].label`, message: 'Place label is required.', severity: 'error' });
    }

    const hasMatcher = !!place.match && Object.keys(place.match).length > 0;
    const hasZoneEntities = asArray(place.zone_entities).length > 0;
    const isFallback = place.kind === 'fallback';
    if (!hasMatcher && !hasZoneEntities && !isFallback) {
      issues.push({
        path: `places[${index}]`,
        message: `Place "${place.id}" has no match rules, zone entities, or fallback kind.`,
        severity: 'warning',
      });
    }
  }

  for (const [index, wizard] of (config.wizards || []).entries()) {
    if (!wizard.entity?.trim()) {
      issues.push({ path: `wizards[${index}].entity`, message: 'Wizard entity is required.', severity: 'error' });
    } else if (wizardEntities.has(wizard.entity)) {
      issues.push({
        path: `wizards[${index}].entity`,
        message: `Duplicate wizard entity "${wizard.entity}".`,
        severity: 'error',
      });
    } else {
      wizardEntities.add(wizard.entity);
    }
  }

  if (config.default_place && !placeIds.has(config.default_place)) {
    issues.push({
      path: 'default_place',
      message: `Default place "${config.default_place}" does not exist in places.`,
      severity: 'error',
    });
  }

  if (!config.default_place && !(config.places || []).some((place) => place.kind === 'fallback')) {
    issues.push({
      path: 'default_place',
      message: 'Consider setting `default_place` or adding a fallback place.',
      severity: 'warning',
    });
  }

  return issues;
}
