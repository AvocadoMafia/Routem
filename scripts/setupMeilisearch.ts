import dotenv from "dotenv";
import { MeiliSearch } from "meilisearch";

dotenv.config();

const setupMeilisearch = async () => {
  const host = process.env.MEILISEARCH_URL || "http://127.0.0.1:7700";
  const apiKey = process.env.MEILISEARCH_APIKEY || "my_master_key";

  const client = new MeiliSearch({ host, apiKey });
  const routes_index = client.index("routes");
  const search_queries_index = client.index("search_queries");

  console.log(" Meilisearchのセットアップを開始します...");

  try {
    console.log(" Filterable Attributes を設定中...");
    await routes_index.updateFilterableAttributes([
      "_geo",
      "visibility",
      "routeFor",
      "month",
      "budgetInUsd",
      "authorId",
      "language",
      "companionType",
      "id",
      "localCurrencyCode",
      "days",
    ]);
    console.log(" Filterable Attributes の設定完了");

    console.log(" Searchable Attributes を設定中...");
    await routes_index.updateSearchableAttributes(["title", "searchText"]);

    console.log(" Sortable Attributes を設定中...");
    await routes_index.updateSortableAttributes(["_geo", "createdAt", "id"]);
    console.log(" Sortable Attributes の設定完了");

    console.log(" すべてのMeilisearchセットアップが正常に完了しました！");
  } catch (error) {
    console.error(" Meilisearchのセットアップ中にエラーが発生しました:");
    console.error(error);
    process.exit(1);
  }
};

setupMeilisearch();
