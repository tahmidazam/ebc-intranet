import { formatName } from "@/lib/format-name";
import { sessionsToICalEventData } from "@/lib/sessions-to-ical-event-data";
import { SEAT_KEYS } from "@/schemas/seat";
import { fetchQuery } from "convex/nextjs";
import ical from "ical-generator";
import { NextResponse } from "next/server";
import { api } from "../../../../../convex/_generated/api";
import { Doc, Id } from "../../../../../convex/_generated/dataModel";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  console.log(token);

  try {
    const calendarToken = await fetchQuery(api.calendarTokens.resolveToken, {
      token,
    });

    if (!calendarToken) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const { id, coach } = calendarToken;

    // Single query for user
    const user = coach
      ? null
      : await fetchQuery(api.user.getById, {
          id: id as Id<"users">,
        });

    if (!user && !coach) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const formattedName = coach ? id : user ? formatName(user) : "Unknown";
    // Create calendar
    const calendar = ical({
      name: `EBC ${coach ? "Coaching " : ""}(${formattedName})`,
    });
    
    // Single query for sessions
    const sessions = coach
      ? await fetchQuery(api.sessions.getByCoach, { coach: id })
      : await fetchQuery(api.sessions.getByUser, {
          userId: id as Id<"users">,
        });

    // Return an empty iCal if no events to avoid errors on client when attempting to sync
    if (!sessions?.length) {
      return new NextResponse(calendar.toString(), {
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename="${formattedName}-sessions.ics"`,
      },
      });
    }

    // Collect unique IDs in a single pass
    const { userIds, collectionIds } = sessions.reduce(
      (acc, session) => {
        // Add all crew members to userIds set
        SEAT_KEYS.forEach((key) => {
          if (session[key]) acc.userIds.add(session[key]);
        });

        // Add collection ID
        acc.collectionIds.add(session.collectionId);

        return acc;
      },
      {
        userIds: new Set<string>(),
        collectionIds: new Set<string>(),
      }
    );

    // Batch fetch all required data
    const [usersArray, collectionsArray] = await Promise.all([
      Promise.all(
        Array.from(userIds).map((uid) =>
          fetchQuery(api.user.getById, { id: uid as Id<"users"> })
        )
      ),
      Promise.all(
        Array.from(collectionIds).map((cid) =>
          fetchQuery(api.collections.getById, { id: cid as Id<"collections"> })
        )
      ),
    ]);

    // Convert sessions to events using the extracted function
    const events = sessionsToICalEventData({
      sessions,
      users: usersArray.filter((user): user is Doc<"users"> => user !== null),
      collections: collectionsArray.filter(
        (collection): collection is Doc<"collections"> => collection !== null
      ),
      currentUserId: id,
      coach,
      token,
      eventOffset: user?.eventOffset
    });

    // Add events to calendar
    events.forEach((event) => {
      calendar.createEvent(event);
    });

    return new NextResponse(calendar.toString(), {
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename="${formattedName}-sessions.ics"`,
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
