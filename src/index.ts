import { Buffer } from "node:buffer";
import { gzipSync } from "node:zlib";
import { build } from "esbuild";
import { bold, cyan, dim, gray, green, lightGray } from "kolorist";
import type { Plugin } from "vite";
import { name } from "../package.json";

function getSize(size: number): string {
  return `${(size / 1024).toFixed(2)} KB`;
}

export default function vitePluginRealImport(entry: string | string[]): Plugin {
  return {
    name,
    apply: "build",
    async closeBundle() {
      const logName = cyan("[vite:real-import]");
      console.log(`\n${logName} ${green("Measuring real import size...")}`);

      try {
        const result = await build({
          entryPoints: Array.isArray(entry) ? entry : [entry],
          bundle: true,
          minify: true,
          write: false,
        });

        const rawSize = Buffer.byteLength(result.outputFiles[0].text, "utf8");
        const gzippedSize = Buffer.byteLength(
          gzipSync(result.outputFiles[0].text),
          "utf8",
        );

        const sizeLabel = dim(`| gzip: ${getSize(gzippedSize)}`);
        console.log(`${logName} ${getSize(rawSize)} ${sizeLabel}`);
        console.log("\n");
      } catch (error) {
        console.error("Error measuring size:", error);
      }
    },
  };
}
