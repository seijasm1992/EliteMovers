import { z } from "zod";

/** Letters, spaces, hyphens, apostrophes, and periods — no digits. */
const NAME_PATTERN = /^[\p{L}\s'.-]+$/u;

/** Digits and common phone formatting characters only. */
const PHONE_PATTERN = /^[\d\s()+\-.]+$/;

/** Native date input value format. */
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const phoneDigits = (value: string) => value.replace(/\D/g, "");

const todayDateString = () => {
  const now = new Date();
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
};

/**
 * Single source of truth for quote-form validation.
 * Shared by the React form (client) and the /api/quote endpoint (server).
 * Enum values must stay in sync with src/data/quoteForm.ts options.
 */
export const quoteSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name is required")
    .max(100, "Full name is too long")
    .regex(NAME_PATTERN, "Enter a valid name (letters only)"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .pipe(z.email("Enter a valid email address")),
  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .regex(PHONE_PATTERN, "Enter a valid phone number")
    .refine(
      (value) => {
        const digits = phoneDigits(value);
        return digits.length >= 10 && digits.length <= 15;
      },
      { message: "Enter a valid phone number (at least 10 digits)" },
    ),

  moveType: z.enum(
    ["local", "long-distance", "office", "commercial", "small", "large"],
    { message: "Select a move type" },
  ),
  originCity: z.string().trim().min(1, "Origin city is required"),
  destinationCity: z.string().trim().min(1, "Destination city is required"),
  moveDate: z
    .string()
    .trim()
    .min(1, "Estimated date is required")
    .regex(DATE_PATTERN, "Enter a valid move date")
    .refine((value) => value >= todayDateString(), {
      message: "Estimated date cannot be in the past",
    }),
  homeSize: z.enum(
    ["studio", "1-bed", "2-bed", "3-bed", "4-bed-plus", "office"],
    { message: "Select a move size" },
  ),
  contactPreference: z.enum(["phone", "email", "text", "any"], {
    message: "Select a contact preference",
  }),

  message: z.string().trim().max(2000, "Message is too long").optional(),
});

export type QuoteFormValues = z.infer<typeof quoteSchema>;
