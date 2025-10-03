import { z } from "zod";

export const eventSchema = z.object({
    id: z.string(),
    summary: z.string(),
    duration: z.number(),
    start: z.date(),
    end: z.date(),
    collectionTitle: z.string(),
    type: z.string(),
    boat: z.string().optional(),
    course: z.string().optional(),
    distance: z.number().optional(),
    coachName: z.string().optional(),
    outline: z.string().optional(),
    seats: z.record(z.string(), z.object({
        name: z.string(),
        id: z.string(),
    })),
    userSeat: z.string().nullable().optional(),
    read: z.array(z.string()),
});
export type Event = z.infer<typeof eventSchema>;