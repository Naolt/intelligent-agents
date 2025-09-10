import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    name: z.string().min(2, "Name must be at least 2 characters"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string(),
  }),
});

// Type inference
export type CreateUserInput = z.infer<typeof createUserSchema>["body"];
export type LoginInput = z.infer<typeof loginSchema>["body"];
