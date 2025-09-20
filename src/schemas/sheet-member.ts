import { z } from "zod";

const SIDE_PREFERENCE_CASES = [
  "strokeside",
  "bowside",
  "bisweptual",
  "N/A",
  "unknown",
] as const;
const sidePreferenceEnum = z.enum(SIDE_PREFERENCE_CASES);

export const sheetMemberSchema = z.object({
  crsid: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.email(),
  phone: z.string(),
  sidePreference: sidePreferenceEnum,
  cox: z.boolean(),
  novice: z.boolean(),
  availabilities: z.record(z.string(), z.string()),
});

export type SheetMember = z.infer<typeof sheetMemberSchema>;
