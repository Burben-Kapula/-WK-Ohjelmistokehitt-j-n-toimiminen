import { z } from "zod";

/**
 * Teoksen luonnin tarkistus (POST /api/posts).
 * Nimi: 3–100 merkkiä, kuvaus: 10–2000 merkkiä.
 */
export const createPostSchema = z.object({
  body: z.object({
    title: z.string()
      .min(3, "Nimessä on oltava vähintään 3 merkkiä.")
      .max(100, "Nimessä saa olla enintään 100 merkkiä."),
    description: z.string()
      .min(10, "Kuvauksessa on oltava vähintään 10 merkkiä.")
      .max(2000, "Kuvauksessa saa olla enintään 2000 merkkiä."),
  }),
});

/**
 * Teoksen muokkaamisen tarkistus (PUT /api/posts/:id).
 */
export const updatePostSchema = z.object({
  body: z.object({
    title: z.string()
      .min(3, "Nimessä on oltava vähintään 3 merkkiä.")
      .max(100, "Nimessä saa olla enintään 100 merkkiä.")
      .optional(),
    description: z.string()
      .min(10, "Kuvauksessa on oltava vähintään 10 merkkiä.")
      .max(2000, "Kuvauksessa saa olla enintään 2000 merkkiä.")
      .optional(),
  }),
});
