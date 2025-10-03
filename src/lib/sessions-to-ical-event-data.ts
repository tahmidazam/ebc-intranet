import { SEAT_KEYS, SEAT_LABELS } from "@/schemas/seat";
import { ICalEventData } from "ical-generator";
import { Doc } from "../../convex/_generated/dataModel";
import { formatName } from "./format-name";

export function sessionsToICalEventData({
  sessions,
  users,
  collections,
  currentUserId,
  coach,
  token,
  eventOffset,
}: {
  sessions: Doc<"sessions">[];
  users: Doc<"users">[];
  collections: Doc<"collections">[];
  currentUserId?: string;
  coach?: boolean;
  token?: string;
  eventOffset?: number;
}): ICalEventData[] {
  // Create lookup maps
  const usersMap = users.reduce((map, user) => {
    if (user) map[user._id] = formatName(user) ?? "";
    return map;
  }, {} as Record<string, string>);

  const collectionsMap = collections.reduce((map, collection) => {
    if (collection) map[collection._id] = collection.title;
    return map;
  }, {} as Record<string, string>);

  // Convert sessions to events
  return sessions.map((session) => {
    const start = new Date(session.timestamp - (eventOffset ?? 0) * 1000);
    const end = new Date(session.timestamp + session.duration * 60 * 1000);

    // Helper function to get user's seat in a session
    const getUserSeat = (userId: string): string | null => {
      const seatIndex = SEAT_KEYS.findIndex((key) => session[key] === userId);
      return seatIndex !== -1 ? SEAT_LABELS[seatIndex] : null;
    };

    // Helper function to build crew list
    const buildCrewList = (): string => {
      return SEAT_LABELS.map((seatName, index) => {
        const userId = session[SEAT_KEYS[index]];
        return userId ? `${seatName}: ${usersMap[userId] || "Unknown"}` : null;
      })
        .filter(Boolean)
        .join("\n");
    };

    const userSeat = currentUserId ? getUserSeat(currentUserId) : null;
    const crewList = buildCrewList();
    const collectionTitle = collectionsMap[session.collectionId] || "Unknown";

    return {
      start,
      end,
      id: session._id,
      summary: `${coach ? "Coaching: " : ""}${collectionTitle} ${
        session.type.charAt(0).toUpperCase() + session.type.slice(1)
      } session`,
      description: [
        ...(session.boat ? [`Boat: ${session.boat}`] : []),
        ...(session.course ? [`Course: ${session.course}`] : []),
        ...(session.distance ? [`Distance: ${session.distance} km`] : []),
        ``,
        ...(session.coach ? [`Coach: ${session.coach}`] : []),
        ...(currentUserId ? [`Your seat: ${userSeat || "N/A"}`, ``] : []),
        `Crew:`,
        crewList,
        ``,
        `Outline: ${session.outline}`,
        ``,
        ...(session.coach || currentUserId
          ? [
              `Comment on this session: https://intranet.emmabc.org/comment/${session._id}/${token}`,
            ]
          : []),
        ``,
        ...(eventOffset
          ? [`N.B., event times adjusted earlier by ${eventOffset / 60} min.`]
          : []),
      ]
        .join("\n")
        .trim(),
      location: "Emmanuel Boathouse, Cutter Ferry Ln, Cambridge, CB4 1JR",
    };
  });
}
