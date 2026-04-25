import { Roboto, Syne, Outfit, Josefin_Sans, Caveat } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import "mapbox-gl/dist/mapbox-gl.css";
import "../globals.css";
import RootClient from "@/app/[locale]/rootClient";
import { ThemeProvider } from "@/app/[locale]/_components/providers/themeProvider";
import StateInitializer from "@/app/[locale]/_components/layout/templates/stateInitializer";
import { locales, type Locale } from '@/i18n/config';
import { buildMetadata } from "@/lib/utils/metadata";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const josefinSans = Josefin_Sans({
  subsets: ["latin"],
  variable: "--font-josefin-sans",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata = buildMetadata();

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
      <body className={`${roboto.variable} ${syne.variable} ${outfit.variable} ${josefinSans.variable} ${caveat.variable} font-sans`}>
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
