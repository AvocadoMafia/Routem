// 👇 これを追加！ これで .env が読み込まれます
import 'dotenv/config'; 
import { defineConfig } from '@prisma/config';

export default defineConfig({
  datasource: {
    url: process.env.DIRECT_URL, // supabase用の接続設定
  },
});