import { access, cp, mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { pathToFileURL } from "node:url";

// This portfolio uses one client-driven page with hash navigation. Export the
// fully rendered page and its assets without a platform-specific server.
const root = process.cwd();
const output = path.join(root, "outputs", "netlify-ready");
try {
  await access(output);
  throw new Error("Output already exists; preserve it before creating another export.");
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
const origin = process.env.PORTFOLIO_PUBLIC_URL ?? "https://static-export.invalid";
const parsedOrigin = new URL(origin);
if (!["http:", "https:"].includes(parsedOrigin.protocol)) throw new Error("Invalid site URL");
const { default: worker } = await import(pathToFileURL(path.join(root, "dist/server/index.js")));
const response = await worker.fetch(new Request(parsedOrigin.origin + "/", {
  headers: { accept: "text/html" },
}), { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } }, {
  waitUntil() {}, passThroughOnException() {},
});
if (response.status !== 200) throw new Error(`Page render failed: ${response.status}`);
let html = await response.text();
if (!process.env.PORTFOLIO_PUBLIC_URL) html = html.replaceAll(parsedOrigin.origin, "");
if (!html.includes("沧州文物海报设计")) throw new Error("The latest portfolio is missing");

await mkdir(output, { recursive: true });
for (const file of await readdir(path.join(root, "dist/client"))) {
  if (file.startsWith(".")) continue;
  await cp(path.join(root, "dist/client", file), path.join(output, file), { recursive: true });
}
await writeFile(path.join(output, "index.html"), html);

let savedBytes = 0;
if (process.env.PORTFOLIO_ASSET_RUNTIME) {
  const require = createRequire(path.join(process.env.PORTFOLIO_ASSET_RUNTIME, "package.json"));
  const sharp = require("sharp");
  const media = path.join(output, "media");
  for (const name of await readdir(media)) {
    const filename = path.join(media, name);
    const info = await stat(filename);
    const extension = path.extname(name).toLowerCase();
    if (info.size < 600_000 || ![".jpg", ".jpeg", ".webp", ".png"].includes(extension)) continue;
    const input = await readFile(filename);
    let pipeline = sharp(input, { limitInputPixels: 250_000_000 })
      .resize({ width: 1800, withoutEnlargement: true });
    if (extension === ".webp") pipeline = pipeline.webp({ quality: 86 });
    else if (extension === ".png") pipeline = pipeline.png({ compressionLevel: 9 });
    else pipeline = pipeline.jpeg({ quality: 88, mozjpeg: true });
    const optimized = await pipeline.toBuffer();
    if (optimized.length < input.length) {
      await writeFile(filename, optimized);
      savedBytes += input.length - optimized.length;
    }
  }
}
console.log(JSON.stringify({ output, savedMegabytes: Math.round(savedBytes / 1024 / 1024) }));
