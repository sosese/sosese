import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const faq = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/faq" }),
  schema: z.object({
    question: z.string(),
    ordre: z.number(),
  }),
});

const exemples = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/exemples" }),
  schema: z.object({
    titre: z.string(),
    avant: z.string(),
    apres: z.string(),
    gain: z.string(),
    ordre: z.number(),
  }),
});

export const collections = { faq, exemples };
