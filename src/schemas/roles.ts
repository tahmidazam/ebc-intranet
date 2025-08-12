import z from "zod";

export const ROLE_CASES = ["admin"] as const;

export const RolesEnum = z.enum(ROLE_CASES);

export type Roles = z.infer<typeof RolesEnum>;

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles;
    };
  }
}
