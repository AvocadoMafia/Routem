/**
 * i18n設定
 * サポートするロケールとデフォルト値を定義
 */

export const locales = ['ja', 'en', 'ko', 'zh'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

// UI表示用のロケール名
export const localeNames: Record<Locale, string> = {
  ja: '日本語',
  en: 'English',
  ko: '한국어',
  zh: '中文',
};

// Accept-Languageヘッダーからロケールへのマッピング
export const localeMapping: Record<string, Locale> = {
  'ja': 'ja',
  'ja-JP': 'ja',
  'en': 'en',
  'en-US': 'en',
  'en-GB': 'en',
  'en-AU': 'en',
  'ko': 'ko',
  'ko-KR': 'ko',
  'zh': 'zh',
  'zh-CN': 'zh',
  'zh-TW': 'zh',
  'zh-HK': 'zh',
};

/**
 * ロケールが有効かどうかを検証
 */
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}
