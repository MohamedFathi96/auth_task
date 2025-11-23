import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).*$/,
      "Password must contain at least one lowercase letter, one number, and one special character"
    ),
});

export type LoginFormData = z.infer<typeof loginSchema>;
