import { z } from "zod";

const serviceCategories = ["Venue", "Hotel", "Caterer", "Cameraman", "DJ"] as const;

export const loginFormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

export const registerFormSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters"),
    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .email("Please enter a valid email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const createServiceFormSchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters"),
  category: z.enum(serviceCategories),
  pricePerDay: z.number().positive("Price per day must be greater than 0"),
  location: z.string().trim().min(2, "Location must be at least 2 characters"),
  description: z.string().max(1000, "Description is too long").optional(),
  contactDetails: z.string().max(300, "Contact details are too long").optional(),
  imageUrl: z
    .string()
    .url("Image URL must be valid")
    .or(z.literal(""))
    .optional(),
  availableDates: z
    .array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"))
    .optional(),
});
