/**
 * ローカライズされたナビゲーションヘルパー
 * next/linkやuseRouterの代わりにこれらを使用
 */

import { createNavigation } from 'next-intl/navigation';
import { locales, defaultLocale } from './config';

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation({
  locales,
  defaultLocale,
  localePrefix: 'as-needed', // デフォルトロケール(en)はプレフィックスなし
});
