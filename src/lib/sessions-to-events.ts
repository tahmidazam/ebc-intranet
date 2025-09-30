import { Event } from "@/schemas/event";
import { SEAT_KEYS, SEAT_LABELS } from "@/schemas/seat";
import { Doc } from "../../convex/_generated/dataModel";
import { capitalise } from "./capitalise";
import { formatName } from "./format-name";

export function sessionsToResolvedEvents(
    sessions: Doc<"sessions">[],
    users: Doc<"users">[],
    collections: Doc<"collections">[],
    currentUserId?: string,
): Event[] {
    const usersMap = users.reduce((map, user) => {
        if (user) map[user._id] = formatName(user) ?? "";
        return map;
    }, {} as Record<string, string>);

    const collectionsMap = collections.reduce((map, collection) => {
        if (collection) map[collection._id] = collection.title;
        return map;
    }, {} as Record<string, string>);

    return sessions.map((session) => {
        const start = new Date(session.timestamp);
        const end = new Date(session.timestamp + session.duration * 60 * 1000);

        // Build seat assignments
        const seats: Record<string, string | null> = {};
        SEAT_KEYS.forEach((key, idx) => {
            const userId = session[key];
            seats[SEAT_LABELS[idx]] = userId ? (usersMap[userId] || "Unknown") : null;
        });

        // Find current user's seat
        let userSeat: string | null = null;
        if (currentUserId) {
            const seatIndex = SEAT_KEYS.findIndex(key => session[key] === currentUserId);
            userSeat = seatIndex !== -1 ? SEAT_LABELS[seatIndex] : null;
        }

        const collectionTitle = collectionsMap[session.collectionId] || "Unknown";

        return {
            id: session._id,
            summary: `${collectionTitle} ${capitalise(session.type)} Session`,
            duration: session.duration,
            start,
            end,
            collectionTitle,
            type: session.type,
            boat: session.boat,
            course: session.course,
            distance: session.distance,
            coachName: session.coach,
            outline: session.outline,
            seats,
            userSeat,
        };
    });
}