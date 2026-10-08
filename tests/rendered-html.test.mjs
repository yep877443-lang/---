import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request("http://localhost/", { headers: { accept: "text/html" } }), {
    ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
  }, { waitUntil() {}, passThroughOnException() {} });
}

test("server-renders the portfolio experience", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /杨子豪/);
  assert.match(html, /PORTFOLIO/);
  assert.match(html, /购物袋里/);
  for (const id of ["home", "profile", "work", "capability", "experience", "contact"]) {
    assert.match(html, new RegExp(`id=["']${id}["']`));
  }
});

test("ships eleven reusable project records and every referenced detail asset", async () => {
  const source = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const records = source.match(/number:\s*"\d{2}"/g) ?? [];
  assert.equal(records.length, 11);
  assert.match(source, /tagType:/);
  assert.match(source, /description:/);
  assert.match(source, /deliverables:/);
  assert.match(source, /project-lightbox/);
  assert.match(source, /ProjectScrollImage/);
  assert.match(source, /ProjectDetailImage/);
  for (const file of [
    "eight-immortals-long-v2.jpg", "sense-series-01.webp", "anabranch-full.jpg",
    "windbrew-long.webp", "mioa-long.webp", "shangshangqian-card.webp", "xuye-long-v3.jpg",
    "product-poster-01.jpg", "logo-archive-v3.jpg", "typeface-full-v2.jpg",
    "hotpot-long-dark.jpg", "hotpot-long-light.jpg",
  ]) {
    await access(new URL(`../public/media/${file}`, import.meta.url));
  }
});
