import { env } from "@prisma/config";
import { Meilisearch } from "meilisearch";

declare global{
    var meilisearch:Meilisearch
}

export const meilisearch : Meilisearch = globalThis.meilisearch ?? new Meilisearch({
  host: process.env.MEILISEARCH_URL!,
  apiKey: process.env.MEILISEARCH_APIKEY!,
});

if (process.env.NODE_ENV !== "production") globalThis.meilisearch = meilisearch;
