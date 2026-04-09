/**
 * next-intl サーバーサイド設定
 * リクエストごとにロケールとメッセージを解決
 */

import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale, type Locale } from './config';

export default getRequestConfig(async ({ requestLocale }) => {
  // リクエストからロケールを取得
  let locale = await requestLocale;

  // ロケールが無効な場合はデフォルトにフォールバック
  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
