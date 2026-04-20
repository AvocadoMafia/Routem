import { exchangeRatesRepository } from "@/features/exchangeRates/repository";
import { RoutesDocumentsType } from "@/features/routes/schema";
import { getMeilisearch } from "@/lib/services/meilisearch";

const updateBudgetInUsd = async () => {
  try {
    const exchange_rates = await exchangeRatesRepository.findMany();

    const meilisearch = getMeilisearch();
    const index = await meilisearch.getIndex("routes");

    for (const rate of exchange_rates) {
      const currency_code = rate.currencyCode;
      const rate_to_usd = rate.rateToUsd;

      const limit = 1000;
      let has_more = true;
      let last_id: string | undefined = undefined;

      while (has_more) {
        let filter = `localCurrencyCode = '${currency_code}'`;
        if (last_id) {
          filter += ` AND id > '${last_id}'`;
        }

        const routes_docs = await index.search("", {
          filter: filter,
          limit: limit,
          sort: ["id:asc"],
        });

        const hits = routes_docs.hits as RoutesDocumentsType;

        if (hits.length === 0) {
          has_more = false;
          break;
        }

        await index.updateDocuments(
          hits.map((doc) => ({
            id: doc.id,
            budgetInUsd: doc.budgetInLocalCurrency
              ? doc.budgetInLocalCurrency * rate_to_usd
              : undefined,
          })),
        );

        last_id = hits[hits.length - 1].id;

        if (hits.length < limit) {
          has_more = false;
        }
      }
    }
    console.info("予算のUSD換算の更新が完了しました");
  } catch (e) {
    console.error("予算のUSD換算の更新中にエラーが発生しました:", e);
    throw e;
  }
};

updateBudgetInUsd();
