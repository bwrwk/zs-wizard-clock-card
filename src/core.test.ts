import { describe, expect, it } from 'vitest';
import {
  deriveWizardContext,
  explainPlaceMatch,
  matchesPlace,
  normalizeList,
  validateConfig,
} from './core';
import type { CardConfig, HomeAssistant, PlaceConfig } from './types';

const hass: HomeAssistant = {
  states: {
    'zone.home': {
      entity_id: 'zone.home',
      state: 'zoning',
      attributes: { friendly_name: 'Dom' },
    },
    'zone.work': {
      entity_id: 'zone.work',
      state: 'zoning',
      attributes: { friendly_name: 'Praca' },
    },
    'input_boolean.family_danger': {
      entity_id: 'input_boolean.family_danger',
      state: 'off',
      attributes: {},
    },
  },
};

describe('normalizeList', () => {
  it('normalizes arrays, strings and object values', () => {
    expect(normalizeList([' Home ', 'work'])).toEqual(['home', 'work']);
    expect(normalizeList('Home, Work')).toEqual(['home', 'work']);
    expect(normalizeList({ a: 'Home', b: ['Work'] })).toEqual(['home', 'work']);
  });
});

describe('matchesPlace', () => {
  const homeContext = deriveWizardContext(
    {
      entity_id: 'person.example',
      state: 'Dom',
      attributes: { zone: 'Dom', locality: 'Krakow', velocity: 0 },
    },
    undefined,
  );

  it('treats states, zones and zone_entities as alternative location signals', () => {
    const place: PlaceConfig = {
      id: 'dom',
      label: 'W domu',
      zone_entities: ['zone.home'],
      match: {
        states: ['home'],
        zones: ['home'],
      },
    };

    expect(matchesPlace(place, homeContext, hass)).toBe(true);
  });

  it('supports zone_entities without explicit match rules', () => {
    const place: PlaceConfig = {
      id: 'dom',
      label: 'W domu',
      zone_entities: ['zone.home'],
    };

    expect(matchesPlace(place, homeContext, hass)).toBe(true);
  });

  it('requires gating rules in addition to location rules', () => {
    const place: PlaceConfig = {
      id: 'travel',
      label: 'W drodze',
      match: {
        states: ['dom'],
        moving: true,
        min_speed: 8,
      },
    };

    expect(matchesPlace(place, homeContext, hass)).toBe(false);
  });

  it('explains why a place matched', () => {
    const place: PlaceConfig = {
      id: 'dom',
      label: 'W domu',
      zone_entities: ['zone.home'],
    };

    expect(explainPlaceMatch(place, homeContext, hass)).toContain('zone_entity:dom');
  });
});

describe('validateConfig', () => {
  it('reports invalid default_place and duplicate entities', () => {
    const config: CardConfig = {
      type: 'custom:zs-wizard-clock-card',
      default_place: 'missing',
      places: [
        { id: 'home', label: 'Home' },
        { id: 'home', label: 'Duplicate' },
      ],
      wizards: [
        { entity: 'person.one' },
        { entity: 'person.one' },
      ],
    };

    const issues = validateConfig(config);
    expect(issues.some((issue) => issue.path === 'default_place' && issue.severity === 'error')).toBe(true);
    expect(issues.some((issue) => issue.path === 'places[1].id' && issue.severity === 'error')).toBe(true);
    expect(issues.some((issue) => issue.path === 'wizards[1].entity' && issue.severity === 'error')).toBe(true);
  });
});
