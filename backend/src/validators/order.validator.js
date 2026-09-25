import { z } from "zod";

// Puhelinnumero: numerot, välilyönnet, + ja - (7–20 merkkiä)
const phoneRegex = /^[\d\s+\-]{7,20}$/;

/**
 * Vaihtoehtoisen tilauslomakkeen tarkistus (POST /api/order).
 */
export const orderSchema = z.object({
  body: z.object({
    name: z.string()
      .min(2, "Nimessä on oltava vähintään 2 merkkiä.")
      .max(50, "Nimessä saa olla enintään 50 merkkiä.")
      .regex(/^[A-Za-zА-Яа-яЇїІіЄє\s\-]+$/, "Nimi voi sisältää vain kirjaimia, välilyöntejä ja yhdysmerkkejä."),
    email: z.string().email("Anna kelvollinen sähköpostiosoite."),
    phone: z.string().regex(phoneRegex, "Anna kelvollinen puhelinnumero."),
    password: z.string()
      .min(8, "Salasanassa on oltava vähintään 8 merkkiä.")
      .regex(/(?=.*[A-Za-z])(?=.*\d)/, "Salasanassa on oltava vähintään yksi kirjain ja yksi numero."),
    orderText: z.string()
      .min(10, "Tilauksen tekstissä on oltava vähintään 10 merkkiä.")
      .max(1000, "Tilauksen tekstissä saa olla enintään 1000 merkkiä."),
  }),
});

/**
 * Etusivun tilauslomakkeen tarkistus (POST /api/order/request).
 */
export const orderRequestSchema = z.object({
  body: z.object({
    firstName: z.string()
      .min(2, "Etunimessä on oltava vähintään 2 merkkiä.")
      .max(50, "Etunimessä saa olla enintään 50 merkkiä."),
    lastName: z.string()
      .min(2, "Sukunimessä on oltava vähintään 2 merkkiä.")
      .max(50, "Sukunimessä saa olla enintään 50 merkkiä."),
    email: z.string().email("Anna kelvollinen sähköpostiosoite."),
    phone: z.string().regex(phoneRegex, "Anna kelvollinen puhelinnumero."),
    description: z.string()
      .min(10, "Kuvauksessa on oltava vähintään 10 merkkiä.")
      .max(2000, "Kuvauksessa saa olla enintään 2000 merkkiä."),
  }),
});
