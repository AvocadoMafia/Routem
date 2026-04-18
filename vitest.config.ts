// vitest.config.ts
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths()], // Next.jsの '@/...' というパス指定を解釈させるため
  test: {
    environment: "node", // APIのテストなのでNode環境を指定
    // next-intl の内部が拡張子なしで `next/server` を import しているため
    // 厳格な ESM リゾルバだと失敗する。該当パッケージを inline 解決対象にして
    // Vite が node_modules 内も通常の解決経路で扱えるようにする。
    server: {
      deps: {
        inline: ["next-intl"],
      },
    },
  },
});
