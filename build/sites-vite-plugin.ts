import { access, cp, mkdir, rm, readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { Plugin } from "vite";

async function exists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return false;
    }
    throw error;
  }
}

// Packages Sites metadata and migrations after Vite finishes compiling.
export function sites(): Plugin {
  let root = process.cwd();

  return {
    name: "sites",
    apply: "build",
    configResolved(config) {
      root = config.root;
    },
    async closeBundle() {
      const outputDirectory = resolve(root, "dist", ".openai");
      const hostingConfig = resolve(root, ".openai", "hosting.json");
      const drizzleSource = resolve(root, "drizzle");

      await rm(outputDirectory, { recursive: true, force: true });
      await mkdir(outputDirectory, { recursive: true });

      if (await exists(hostingConfig)) {
        await cp(hostingConfig, resolve(outputDirectory, "hosting.json"));
      }
      if (await exists(drizzleSource)) {
        await cp(drizzleSource, resolve(outputDirectory, "drizzle"), {
          recursive: true,
        });
      }

      // Publish only artwork used by the current portfolio, keeping the
      // original large files and previous revisions available locally.
      const mediaDirectory = resolve(root, "dist", "client", "media");
      if (await exists(mediaDirectory)) {
        const sources = await Promise.all(
          ["app/page.tsx", "app/globals.css", "app/layout.tsx"].map((file) =>
            readFile(resolve(root, file), "utf8"),
          ),
        );
        const referenced = new Set(
          [...sources.join("\n").matchAll(/\/media\/([^\s"'`)]+)/g)].map((match) => match[1]),
        );
        for (const file of await readdir(mediaDirectory, { withFileTypes: true })) {
          if (file.isFile() && !referenced.has(file.name)) {
            await rm(resolve(mediaDirectory, file.name));
          }
        }
      }
    },
  };
}
