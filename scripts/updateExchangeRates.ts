import { getPrisma } from "@/lib/db/prisma";
import { CurrencyCode } from "@prisma/client";
import { ExchangeRate, ExchangeRateSchema } from "./schema";

/**
 * @brief 為替レートを更新するスクリプト
 * 1. Open Exchange Rates APIから為替レートを取得
 * 2. Zodスキーマでデータの検証
 * 3. Prismaのupsert機能を使ってDBに保存
 * 使用方法：cronなどで定期的に実行することを想定
 * 注意点：OPENEXCHANGERATES_URL環境変数にAPIエンドポイントを設定しておく必要があり
 */
const updateExchangeRate = async () => {
  try {
    // fetch
    const res = await fetch(process.env.OPENEXCHANGERATES_URL!);
    if (res.ok) throw new Error(`為替レートの取得に失敗しました: ${res.status} ${res.statusText}`);

    const data = await res.json();
    const exchange_rates = data.rates;

    // Zodスキーマ検証
    const parsed = ExchangeRateSchema.safeParse(exchange_rates);
    if (!parsed.success) {
      console.error("為替レートのスキーマ検証に失敗しました:", parsed.error);
      throw new Error("為替レートのスキーマ検証に失敗しました");
    }
    const parsed_data: ExchangeRate = parsed.data;

    // Prismaのupsert用の引数を作成
    const prisma = getPrisma();
    const args = Object.entries(parsed_data).map(([currency_code, rate_to_usd]) => {
      return prisma.exchangeRates.upsert({
        where: { currencyCode: currency_code as CurrencyCode },
        create: { currencyCode: currency_code as CurrencyCode, rateToUsd: rate_to_usd },
        update: { rateToUsd: rate_to_usd, updatedAt: new Date() },
      });
    });

    // DB更新
    await prisma.$transaction(args);
    console.info("為替レートの更新が完了しました");
  } catch (error) {
    console.error("為替レートの更新中にエラーが発生しました:", error);
  }
};

updateExchangeRate();
