import { z } from "zod";
import { sidePreferenceEnum } from "./side-preference";

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
