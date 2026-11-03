import { docsLoader } from "@astrojs/starlight/loaders";
import { docsSchema } from "@astrojs/starlight/schema";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      // Set by scripts/sync-docs.mjs: repository path of the mirrored source file.
      extend: z.object({ sourcePath: z.string().optional() }),
    }),
  }),
};
