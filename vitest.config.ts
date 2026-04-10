// vitest.config.ts
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths()], // Next.jsの '@/...' というパス指定を解釈させるため
  test: {
    environment: "node", // APIのテストなのでNode環境を指定
  },
});
