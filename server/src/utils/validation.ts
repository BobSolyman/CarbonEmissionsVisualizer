import { z } from "zod";

const NodeSchema = z.object({
  id: z.string(),
  name: z.string(),
  weight: z.number().positive(),
  emissions: z.number().nonnegative(),
});

const EdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  weight: z.number().positive(),
  emissions: z.number().nonnegative(),
});

export const GraphSchema = z.object({
  nodes: z.array(NodeSchema),
  edges: z.array(EdgeSchema),
});

export type GraphInput = z.infer<typeof GraphSchema>;
