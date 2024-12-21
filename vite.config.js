import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "src/client/libraries",
    lib: {
      entry: "./src/api/index.ts", // 번들링할 파일 경로
      name: "apis", // 번들링된 글로벌 변수 이름
      fileName: "index.js", // 출력 파일 이름 (예: bundle.js)
    },
  },
});
