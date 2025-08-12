import z from "zod";

export const MemberSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  emailAddress: z.email(),
  collectionIds: z.array(z.string()),
});

export type Member = z.infer<typeof MemberSchema>;
