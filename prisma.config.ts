// 👇 これを追加！ これで .env が読み込まれます
import 'dotenv/config'; 
import { defineConfig } from '@prisma/config';

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
    migrations: {
        seed: "tsx ./prisma/seed.ts",
    },
});