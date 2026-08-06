import { z } from "zod";

const NAME_PATTERN = /^[\p{L} '.-]+$/u;
const PHONE_PATTERN = /^[\d\s()+\-.]+$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const dateInNewYork = () => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const value = (type: "year" | "month" | "day") => parts.find((part) => part.type === type)?.value ?? "";
  return `${value("year")}-${value("month")}-${value("day")}`;
};

export const todayMoveDate = () => dateInNewYork();

export const sanitizeName = (value: string) => value.replace(/[^\p{L} '.-]/gu, "");
export const sanitizePhone = (value: string) => {
  let digits = 0;
  return value.replace(/[^\d\s()+\-.]/g, "").replace(/\d/g, (digit) => {
    digits += 1;
    return digits <= 10 ? digit : "";
  });
};
export const phoneDigits = (value: string) => value.replace(/\D/g, "");

export const quoteSchema = z.object({
  originCity: z.string().trim().min(1, "Enter your origin city").max(160),
  destinationCity: z.string().trim().min(1, "Enter your destination city").max(160),
  moveDate: z
    .string()
    .regex(DATE_PATTERN, "Select your moving date")
    .refine((value) => value >= todayMoveDate(), "Moving date cannot be in the past"),
  homeSize: z.enum(["studio", "one-bedroom", "two-bedroom", "three-bedroom", "four-plus"], { message: "Select your move size" }),
  fullName: z
    .string()
    .trim()
    .min(2, "Enter your full name")
    .max(100, "Full name must be 100 characters or fewer")
    .regex(NAME_PATTERN, "Use letters only"),
  phone: z
    .string()
    .trim()
    .regex(PHONE_PATTERN, "Use numbers and phone formatting only")
    .refine((value) => phoneDigits(value).length === 10, "Enter a 10-digit phone number"),
  email: z
    .string()
    .trim()
    .min(1, "Enter your email address")
    .max(100, "Email must be 100 characters or fewer")
    .refine((value) => !/\s/.test(value), "Enter one email address without spaces")
    .pipe(z.email("Enter a valid email address")),
});

export type QuoteFormValues = z.infer<typeof quoteSchema>;
