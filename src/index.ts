import { Buffer } from "node:buffer";
import { gzipSync } from "node:zlib";
import { build, type OutputFile } from "esbuild";
import { cyan, dim, green } from "kolorist";
import type { Plugin } from "vite";
import { name } from "../package.json";

const logName = cyan("[vite:real-import]");
function log(message: string) {
  console.log(logName, message);
}

function getSize(size: number): string {
  return `${(size / 1024).toFixed(2)} KB`;
}

function calculateFileSize(file: OutputFile): string {
  const rawSize = Buffer.byteLength(file.text, "utf8");
  const gzippedSize = Buffer.byteLength(gzipSync(file.text), "utf8");
  const fileSize = getSize(rawSize);
  const fileSizeGzip = getSize(gzippedSize);

  return `${fileSize} ${dim(`| gzip: ${fileSizeGzip}`)}`;
}

export default function vitePluginRealImport(entry: string | string[]): Plugin {
  return {
    name,
    apply: "build",
    async closeBundle() {
      log(green("Measuring real import size..."));

      try {
        const result = await build({
          entryPoints: Array.isArray(entry) ? entry : [entry],
          bundle: true,
          minify: true,
          write: false,
        });

        for (const file of result.outputFiles) {
          log(calculateFileSize(file));
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          log(`Error measuring size: ${error.message}`);
        } else {
          log("Error measuring size: unknown error");
        }
      }
    },
  };
}
