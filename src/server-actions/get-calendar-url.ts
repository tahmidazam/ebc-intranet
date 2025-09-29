"use server";

import { fetchMutation } from "convex/nextjs";
import { randomBytes } from "crypto";
import { api } from "../../convex/_generated/api";

export async function getCalendarUrl(id: string, coach: boolean) {
    const potentialNewToken = randomBytes(32).toString("hex");
    const token = await fetchMutation(api.calendarTokens.provisionToken, { id, coach, token: potentialNewToken });

    const url = `webcal://intranet.emmabc.org/api/cal/${token}`;
    return url;
}