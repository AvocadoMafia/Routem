import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import "mapbox-gl/dist/mapbox-gl.css";
import "../globals.css";
import RootClient from "@/app/[locale]/rootClient";
import { ThemeProvider } from "@/app/[locale]/_components/providers/themeProvider";
import StateInitializer from "@/app/[locale]/_components/layout/templates/stateInitializer";
import { locales, type Locale } from '@/i18n/config';

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  title: "Routem",
  description: "Share your travel routes with the world",
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // ロケールが無効な場合は404
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // 翻訳メッセージを取得
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${roboto.variable} font-sans`}>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <RootClient>{children}</RootClient>
            <StateInitializer />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
