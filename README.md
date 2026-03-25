# ZS Wizard Clock Card

An elegant wizard-style family location clock for Home Assistant Lovelace.

## Status

Current release line: `0.7.0`

This version includes:

- a more stable matching engine
- config validation
- automated tests for the core logic
- a richer Home Assistant config editor
- runtime i18n based on the Home Assistant/frontend language

## Vision

`zs-wizard-clock-card` is inspired by the Weasley family clock, but built as a more polished and more configurable custom card:

- SVG-based dial instead of canvas
- configurable places shown on the dial
- per-person styling
- flexible place matching with zone, state, locality, speed and proximity rules
- theme-aware visual presets for a magical brass-and-enamel look

## Highlights

- Circular SVG clock face with decorative outer rings
- Configurable places around the dial
- Automatic person-to-place resolution
- Support for `person`, `device_tracker` and `calendar`
- Optional movement detection via speed and proximity sensors
- Smarter hand spreading when multiple people point to the same place
- Entity picture avatars on hands and legend when available
- Clickable hands and legend entries that open Home Assistant more-info
- Center medallion with summary state
- Optional place sectors on the dial
- Optional decorative ornaments around the clock rim
- Basic debug mode for live matcher inspection
- Runtime i18n for card copy and debug labels

## Installation

### HACS

Add this repository as a custom frontend repository, then install `ZS Wizard Clock Card`.

### Manual

1. Copy `zs-wizard-clock-card.js` to `config/www/`
2. Add `/local/zs-wizard-clock-card.js` as a Lovelace resource
3. Add the card manually

## Example

```yaml
type: custom:zs-wizard-clock-card
title: Rodzina Werewkow
subtitle: Tyniec
style:
  preset: brass
  danger_glow: true
  show_center_panel: true
  show_place_sectors: false
  show_ornaments: true
  show_legend: true
places:
  - id: dom
    label: W domu
    zone_entities:
      - zone.home
      - zone.dom
    match:
      states: [home]
      zones: [home]
  - id: work
    label: W pracy
    zone_entities:
      - zone.praca
    match:
      zones: [work, biuro]
      states: [work]
  - id: school
    label: W szkole
    match:
      zones: [school, szkola]
  - id: travelling
    label: W podrozy
    kind: transient
    priority: 80
    match:
      moving: true
      min_speed: 8
      proximity_directions: [towards, away_from]
  - id: danger
    label: Smiertelne niebezpieczenstwo
    kind: alert
    priority: 100
    match:
      entities:
        - entity: input_boolean.family_danger
          state: "on"
  - id: unknown
    label: Nieznane
    kind: fallback
default_place: unknown
wizards:
  - entity: person.bartlomiej_werewka
    name: Bartek
```

## Place Matching

Places are resolved in descending priority, then in YAML order.

Supported `match` fields:

- `states`
- `zones`
- `localities`
- `min_speed`
- `max_speed`
- `moving`
- `proximity_directions`
- `unavailable`
- `unknown`
- `not_home`
- `entities`

You can also use `zone_entities` on a place for easier UI-driven setup:

```yaml
places:
  - id: work
    label: W pracy
    zone_entities:
      - zone.work
```

Matching semantics:

- `states`, `zones`, `zone_entities` and `localities` are treated as alternative ways to identify the same place
- movement and status gates like `min_speed`, `moving`, `proximity_directions`, `unknown`, `not_home` and `entities` are treated as additional requirements

## Config Editor

The Home Assistant config editor supports:

- style toggles such as sectors, center panel, ornaments, legend and debug
- filtered entity selectors for tracked people
- filtered proximity selectors
- direct `zone.*` selection for places
- nested extra entity conditions in `match.entities`

The entity selectors are narrowed where it makes sense:

- tracked wizards prefer `person`, while still allowing `device_tracker` and `calendar`
- proximity selection is limited to `sensor` and `proximity`
- place zones can be picked directly via `zone_entities`

## i18n

Runtime card text follows the current Home Assistant/frontend language with a fallback to English.

Currently included:

- `en`
- `pl`

This covers card copy such as:

- the eyebrow/title fallback
- summary text in the center medallion
- debug labels
- empty-state copy
- config form labels/helpers based on browser language

User-defined place labels remain exactly as configured in YAML.

## Validation

The card validates configuration and surfaces clear errors for:

- missing places
- missing wizards
- duplicate place IDs
- duplicate wizard entities
- invalid `default_place`

Warnings are also produced internally for weak configurations, such as places without match rules and no fallback behavior.

## Debugging

If a person is shown in the wrong place, temporarily enable:

```yaml
style:
  debug: true
```

This shows the raw:

- `state`
- `zone`
- `friendlyZone`
- `locality`
- `speed`
- `moving`
- `proximity`
- `matchedBy`

## Development

```bash
npm install
npm test
npm run build
```
