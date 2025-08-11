import { z } from "zod";

export const booleanEnum = z
  .enum(["true", "false"])
  .transform((value) => value === "true");
