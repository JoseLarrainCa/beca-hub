import { z } from "zod";

export const ReportsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
  from: z.string().datetime(),   // OBLIGATORIO
  to: z.string().datetime(),     // OBLIGATORIO
  merchantIds: z.string().optional().transform(s => s ? s.split(",") : []),
  studentQuery: z.string().optional().default(""),
  payment: z.enum(["wallet","card","cash"]).optional(),
  type: z.enum(["purchase","topup","adjustment"]).optional(),
  minAmount: z.coerce.number().optional(),
  maxAmount: z.coerce.number().optional(),
  sortBy: z.enum(["date","merchant","email","type","payment","amount"]).default("date"),
  sortDir: z.enum(["asc","desc"]).default("desc"),
});

export type ReportsQuery = z.infer<typeof ReportsQuerySchema>;

export function buildOrderBy(q: ReportsQuery) {
  const dir = q.sortDir;
  switch (q.sortBy) {
    case "merchant": return { merchant: { name: dir } } as const;     // relación
    case "email":    return { student: { email: dir } } as const;      // relación
    case "amount":   return { amountCents: dir } as const;
    case "type":     return { type: dir } as const;
    case "payment":  return { payment: dir } as const;
    default:         return { createdAt: dir } as const;               // "date"
  }
}
