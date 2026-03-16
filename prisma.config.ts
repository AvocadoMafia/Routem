// 👇 これを追加！ これで .env が読み込まれます
import 'dotenv/config'; 
import { defineConfig } from '@prisma/config';

export default defineConfig({
  datasource: {
    url: process.env.DB_TYPE === 'vercel' ? process.env.VERCEL_DIRECT_URL : process.env.LOCAL_DATABASE_URL,
  },
    migrations: {
        seed: "tsx ./prisma/seed.ts",
    },
});