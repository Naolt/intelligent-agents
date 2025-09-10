import { z } from "zod";

// Reusable schemas
export const paginationSchema = z.object({
  query: z.object({
    page: z.string().optional().transform(Number).pipe(z.number().min(1)),
    limit: z
      .string()
      .optional()
      .transform(Number)
      .pipe(z.number().min(1).max(100)),
    sortBy: z.enum(["createdAt", "updatedAt"]).optional(),
    order: z.enum(["asc", "desc"]).optional(),
  }),
});

export const idParamSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ID"),
  }),
});
