import { z } from "zod";
import { MENU_CATEGORIES, MENU_STATUSES, RESERVATION_STATUSES } from "@/types/domain";

const imageUrlSchema = z.string().trim().min(1, "Image URL is required.").refine(
  (value) => value.startsWith("/") || /^https?:\/\//i.test(value),
  "Image URL must be a full http(s) URL or a local path like /menu-assets/dish.png.",
);

export const menuItemSchema = z.object({
  name: z.string().trim().min(1, "Dish name is required.").max(100),
  description: z.string().trim().min(1, "Description is required.").max(2_000),
  price: z.coerce.number().min(0, "Price must be zero or higher."),
  category: z.enum(MENU_CATEGORIES),
  imageUrl: imageUrlSchema,
  imagePublicId: z.string().trim().optional(),
  status: z.enum(MENU_STATUSES).default("Published"),
  available: z.coerce.boolean().default(true),
});
export const menuPatchSchema = menuItemSchema.partial();
export const reservationCreateSchema = z.object({
  name: z.string().trim().min(2, "Full name must have at least 2 characters.").max(100),
  email: z.string().trim().email("A valid email address is required.").max(160),
  phone: z.string().trim().min(8, "A valid phone number is required.").max(40),
  guests: z.coerce.number().int().min(1).max(100),
  date: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must use YYYY-MM-DD."),
  time: z.string().trim().min(1).max(20),
  specialRequest: z.string().trim().max(2_000).optional().default(""),
});
export const reservationPatchSchema = z.object({
  status: z.enum(RESERVATION_STATUSES).optional(),
  isRead: z.boolean().optional(),
});
export function zodFields(error: z.ZodError) {
  return Object.fromEntries(error.issues.map((issue) => [issue.path.join(".") || "form", issue.message]));
}
