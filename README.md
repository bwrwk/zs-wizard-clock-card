# ZS Wizard Clock Card

An elegant wizard-style family location clock for Home Assistant Lovelace.

## Vision

`zs-wizard-clock-card` is inspired by the Weasley family clock, but built as a more polished and more configurable custom card:

- SVG-based dial instead of canvas
- configurable places shown on the dial
- per-person styling
- flexible place matching with zone, state, locality, speed and proximity rules
- theme-aware visual presets for a magical brass-and-enamel look

## Features in v0.4.0

- Circular SVG clock face with decorative outer rings
- Configurable places around the dial
- Automatic person-to-place resolution
- Support for device trackers, person entities and calendars
- Optional movement detection via speed and proximity sensors
- Pretty hand animations
- Smarter hand spreading when multiple people point to the same place
- Entity picture avatars on hands and legend when available
- Clickable legend entries that open Home Assistant more-info
- Center medallion with summary state
- Optional place sectors on the dial
- Legend with each wizard's resolved status
- Basic Home Assistant config editor support
- Narrower entity selectors in the config editor
- Direct `zone.*` selection for places in the config editor
- Optional decorative ornaments around the clock rim
- Clickable hands and legend entries for quick more-info access
- Visual presets: `brass`, `parchment`, `ministry`

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
title: Family Clock
subtitle: The Burrow
style:
  preset: brass
  danger_glow: true
  show_center_panel: true
  show_place_sectors: true
  show_ornaments: true
places:
  - id: home
    label: W domu
    zone_entities: [zone.home]
    match:
      states: [home]
      zones: [home]
  - id: work
    label: W pracy
    match:
      zones: [work, biuro]
      states: [work]
  - id: school
    label: W szkole
    match:
      zones: [school, szkola]
  - id: travelling
    label: W podróży
    kind: transient
    priority: 80
    match:
      moving: true
      min_speed: 8
      proximity_directions: [towards, away_from]
  - id: danger
    label: Śmiertelne niebezpieczeństwo
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
  - entity: person.harry
    name: Harry
    color: "#7a1f1f"
    text_color: "#fff7eb"
  - entity: person.ginny
    name: Ginny
    color: "#0f5b4f"
  - entity: person.hermione
    name: Hermione
    color: "#855f2d"
    proximity_entity: sensor.home_hermione_direction_of_travel
    show_avatar: true
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
- `entities` as extra conditions

Matching semantics:

- `states`, `zones`, `zone_entities` and `localities` are treated as alternative ways to identify the same place
- movement and status gates like `min_speed`, `moving`, `proximity_directions`, `unknown`, `not_home` and `entities` are treated as additional requirements

You can also use `zone_entities` on a place for an easier UI-driven setup:

```yaml
places:
  - id: work
    label: W pracy
    zone_entities:
      - zone.work
```

## Style Options

Supported `style` fields:

- `preset`
- `ha_theme`
- `accent_color`
- `background`
- `text_color`
- `inner_glow`
- `danger_glow`
- `show_legend`
- `show_center_panel`
- `show_place_sectors`
- `sector_opacity`
- `show_ornaments`

## v0.4 editor support

The card now exposes a basic Home Assistant config editor, including a dedicated toggle for:

- `Show place sectors`
- `Show center panel`
- `Show legend`
- `Show ornaments`
- preset selection and core style options

The editor now also narrows entity pickers:

- tracked wizard entities prefer `person`, while still allowing `device_tracker` and `calendar`
- proximity selection is limited to `sensor` and `proximity`
- places can directly pick `zone.*` entities

## Debugging

If a person is shown in the wrong place, temporarily enable:

```yaml
style:
  debug: true
```

This shows the raw `state`, `zone`, `friendlyZone`, `locality`, `speed` and the matching reason used by the card.

Advanced matching is still easiest in YAML for now, but common card setup can already be done in the UI.

Example:

```yaml
match:
  zones: [office]
  states: [work]
  entities:
    - entity: binary_sensor.workday_sensor
      state: "on"
```

## Development

```bash
npm install
npm run build
```
