import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter valid email"),
  password: z.string().min(6, "Password must have at least 6 characters"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter valid email"),
});
