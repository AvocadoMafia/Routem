// Meilisearch クライアントのシングルトン getter。
// 旧 lib/config/server.ts から分離。

import { Meilisearch } from "meilisearch";

declare global {
    // eslint-disable-next-line no-var
    var meilisearch: Meilisearch;
}

export function getMeilisearch() {
    // global 変数として存在した場合のガード節
    if (globalThis.meilisearch) return globalThis.meilisearch;

    globalThis.meilisearch = new Meilisearch({
        host: process.env.MEILISEARCH_URL!,
        apiKey: process.env.MEILISEARCH_APIKEY!,
    });

    return globalThis.meilisearch;
}
