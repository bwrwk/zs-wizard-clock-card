import { describe, expect, it } from 'vitest';
import { getHassLanguage, getTranslations, normalizeLanguage } from './i18n';

describe('i18n', () => {
  it('normalizes language codes', () => {
    expect(normalizeLanguage('pl-PL')).toBe('pl');
    expect(normalizeLanguage('en-US')).toBe('en');
  });

  it('detects Home Assistant language', () => {
    expect(getHassLanguage({ states: {}, language: 'pl-PL' })).toBe('pl');
    expect(getHassLanguage({ states: {}, locale: { language: 'en-US' } })).toBe('en');
  });

  it('returns translated runtime strings', () => {
    expect(getTranslations('pl').eyebrow).toBe('Obecnosc Czarodziejow');
    expect(getTranslations('en').allWatched).toBe('all watched');
  });
});
