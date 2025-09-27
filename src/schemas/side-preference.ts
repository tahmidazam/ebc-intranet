import { z } from "zod";

export const SIDE_PREFERENCE_CASES = [
  "strokeside",
  "bowside",
  "bisweptual",
  "N/A",
  "unknown",
] as const;
export const sidePreferenceEnum = z.enum(SIDE_PREFERENCE_CASES);
export type SidePreference = z.infer<typeof sidePreferenceEnum>;