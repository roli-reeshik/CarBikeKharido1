/**
 * Shared Zod schemas for the admin portal.
 *
 * Server actions parse FormData with these, and the React Hook Form clients
 * use the same objects via `zodResolver`, so a validation rule can never drift
 * between the browser and the mutation.
 */
import { z } from "zod";

export const loginSchema = z.object({
  password: z.string().min(1, "Enter the admin password"),
});

export const variantUpdateSchema = z.object({
  variantId: z.string().min(1),
  exShowroomRupees: z.coerce
    .number()
    .positive("Price must be greater than zero")
    .max(5_00_00_000, "That looks like a typo — check the number of zeroes"),
  isPopular: z.boolean(),
});

export const rtoUpdateSchema = z.object({
  ruleId: z.string().min(1),
  taxPercentage: z.coerce
    .number()
    .min(0, "Tax cannot be negative")
    .max(100, "Tax cannot exceed 100%"),
  cessPercentage: z.coerce
    .number()
    .min(0, "Cess cannot be negative")
    .max(100, "Cess cannot exceed 100%"),
  fixedFeeRupees: z.coerce.number().min(0).max(1_00_000),
});

export const imageSchema = z.object({
  vehicleId: z.string().min(1),
  url: z
    .string()
    .min(1, "Paste an image URL")
    .refine(
      (value) => value.startsWith("https://") || value.startsWith("/"),
      "Enter a full https:// URL, or a local path such as /vehicles/photo.jpg",
    ),
  type: z.enum(["HERO_CUTOUT", "STUDIO_360", "PRESS_EDITORIAL", "INTERIOR"]),
  caption: z.string().max(200).optional(),
});

export type VariantUpdateInput = z.infer<typeof variantUpdateSchema>;
export type RtoUpdateInput = z.infer<typeof rtoUpdateSchema>;
export type ImageInput = z.infer<typeof imageSchema>;
