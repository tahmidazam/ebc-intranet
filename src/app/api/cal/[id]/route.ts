import { formatName } from "@/lib/format-name";
import { fetchQuery } from "convex/nextjs";
import ical, { ICalEventData } from "ical-generator";
import { NextResponse } from "next/server";
import { api } from "../../../../../convex/_generated/api";
import { Doc, Id } from "../../../../../convex/_generated/dataModel";

// Define seat order and mapping for reusability
const SEAT_ORDER = ["Cox", "Stroke", "7", "6", "5", "4", "3", "2", "Bow"] as const;
const SEAT_KEYS = ["cox", "stroke", "seven", "six", "five", "four", "three", "two", "bow"] as const;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // Single query for user
    const user = await fetchQuery(api.user.getById, {
      id: id as Id<"users">,
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Single query for sessions
    const sessions = await fetchQuery(api.sessions.getByUser, {
      userId: id as Id<"users">,
    });

    if (!sessions?.length) {
      return NextResponse.json({ message: "No sessions found" }, { status: 404 });
    }

    // Collect unique IDs in a single pass
    const { userIds, collectionIds } = sessions.reduce(
      (acc, session) => {
        // Add all crew members to userIds set
        SEAT_KEYS.forEach(key => {
          if (session[key]) acc.userIds.add(session[key]);
        });
        
        // Add collection ID
        acc.collectionIds.add(session.collectionId);
        
        return acc;
      },
      { 
        userIds: new Set<string>(), 
        collectionIds: new Set<string>() 
      }
    );

    // Batch fetch all required data
    const [usersArray, collectionsArray] = await Promise.all([
      Promise.all(
        Array.from(userIds).map(uid =>
          fetchQuery(api.user.getById, { id: uid as Id<"users"> })
        )
      ),
      Promise.all(
        Array.from(collectionIds).map(cid =>
          fetchQuery(api.collections.getById, { id: cid as Id<"collections"> })
        )
      )
    ]);

    // Create lookup maps
    const usersMap = usersArray.reduce((map, user) => {
      if (user) map[user._id] = formatName(user) ?? "";
      return map;
    }, {} as Record<string, string>);

    const collectionsMap = collectionsArray.reduce((map, collection) => {
      if (collection) map[collection._id] = collection.title;
      return map;
    }, {} as Record<string, string>);

    // Create calendar
    const calendar = ical({ name: `${formatName(user)}'s Rowing Sessions` });

    // Helper function to get user's seat in a session
    const getUserSeat = (session: Doc<"sessions">, userId: string): string | null => {
      const seatIndex = SEAT_KEYS.findIndex(key => session[key] === userId);
      return seatIndex !== -1 ? SEAT_ORDER[seatIndex] : null;
    };

    // Helper function to build crew list
    const buildCrewList = (session: Doc<"sessions">): string => {
      return SEAT_ORDER
        .map((seatName, index) => {
          const userId = session[SEAT_KEYS[index]];
          return userId ? `${seatName}: ${usersMap[userId] || "Unknown"}` : null;
        })
        .filter(Boolean)
        .join("\n");
    };

    // Add events to calendar
    sessions.forEach((session) => {
      const start = new Date(session.timestamp);
      const end = new Date(session.timestamp + session.duration * 60 * 1000);
      const userSeat = getUserSeat(session, id);
      const crewList = buildCrewList(session);
      const collectionTitle = collectionsMap[session.collectionId] || "Unknown";

      const event: ICalEventData = {
        start,
        end,
        id: session._id,
        summary: `${collectionTitle} ${session.type.charAt(0).toUpperCase() + session.type.slice(1)} session`,
        description: [
          `Boat: ${session.boat}`,
          `Course: ${session.course}`,
          `Distance: ${session.distance} km`,
          ``,
          `Coach: ${session.coach}`,
          `Your seat: ${userSeat || "N/A"}`,
          ``,
          `Crew:`,
          crewList,
          ``,
          `Outline: ${session.outline}`
        ].join("\n").trim(),
        location: "Emmanuel Boathouse, Cutter Ferry Ln, Cambridge, CB4 1JR",
      };

      calendar.createEvent(event);
    });

    return new NextResponse(calendar.toString(), {
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename="${formatName(user)}-sessions.ics"`,
      },
    });

  } catch (error) {
    console.error("Error generating calendar:", error);
    return NextResponse.json(
      { message: "Internal server error" }, 
      { status: 500 }
    );
  }
}