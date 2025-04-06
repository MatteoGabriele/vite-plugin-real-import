import path from "node:path";
import { defineConfig } from "vitest/config";
import dts from "vite-plugin-dts";
import { name } from './package.json'

export default defineConfig({
  build: {
    outDir: "dist",
    lib: {
      entry: path.resolve(__dirname, "./src/index.ts"),
      formats: ["es"],
      target: "node",
      name: "VitePluginRealImport",
      fileName: name,
    },
    rollupOptions: {
      external: [
        "node:buffer",
        "node:zlib",
        "esbuild"
      ]
    }
  },
  plugins: [
    dts({
      insertTypesEntry: true,
      rollupTypes: true,
    }),
  ],
});
