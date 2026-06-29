import { endOfMonth, isAfter, startOfDay } from "date-fns";
import { z } from "zod";

export function stripNonDigits(value: string) {
  return value.replace(/\D/g, "");
}

export function formatCardNumber(value: string) {
  const digits = stripNonDigits(value).slice(0, 19);
  return digits.replace(/(\d{4})(?=\d)/g, "$1-");
}

export function formatExpiry(value: string) {
  const digits = stripNonDigits(value).slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function isExpiryInFuture(expiry: string) {
  const match = /^(\d{2})\/(\d{2})$/.exec(expiry);
  if (!match) return false;

  const month = Number(match[1]);
  const year = Number(match[2]);

  if (month < 1 || month > 12) return false;

  const fullYear = 2000 + year;
  const expiryDate = endOfMonth(new Date(fullYear, month - 1, 1));
  return isAfter(expiryDate, startOfDay(new Date()));
}

export const paymentFormSchema = z.object({
  email: z.string().trim().email("Enter a valid e-mail address"),
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .refine((value) => stripNonDigits(value).length >= 6, {
      message: "Enter a valid phone number",
    }),
  comments: z.string().trim().optional(),
  cardNumber: z
    .string()
    .trim()
    .min(1, "Card number is required")
    .refine((value) => {
      const digits = stripNonDigits(value);
      return digits.length >= 13 && digits.length <= 19;
    }, "Enter a valid card number"),
  expiry: z
    .string()
    .trim()
    .regex(/^\d{2}\/\d{2}$/, "Enter expiry as MM/YY")
    .refine(isExpiryInFuture, "Expiration date must be in the future"),
  cvv: z
    .string()
    .trim()
    .regex(/^\d{3}$/, "CVV must be exactly 3 digits"),
  cardHolderFirstName: z
    .string()
    .trim()
    .min(1, "Card holder first name is required"),
  cardHolderLastName: z
    .string()
    .trim()
    .min(1, "Card holder last name is required"),
  newsletter: z.boolean().optional(),
  acceptTerms: z.boolean().refine((value) => value === true, {
    message: "You must accept the terms of use",
  }),
});

export type PaymentFormValues = z.infer<typeof paymentFormSchema>;

export function aggregateBookingUnits(
  rooms: { unitId: string; rateId: string }[]
) {
  const counts = new Map<string, { unitId: string; rateId: string; quantity: number }>();

  for (const room of rooms) {
    const key = `${room.unitId}:${room.rateId}`;
    const existing = counts.get(key);

    if (existing) {
      existing.quantity += 1;
    } else {
      counts.set(key, {
        unitId: room.unitId,
        rateId: room.rateId,
        quantity: 1,
      });
    }
  }

  return Array.from(counts.values());
}
