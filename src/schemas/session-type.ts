import z from "zod";

export const SESSION_TYPE_CASES = ["water", "land"] as const;
export const sessionTypeSchema = z.enum(SESSION_TYPE_CASES);
export type SessionType = z.infer<typeof sessionTypeSchema>;