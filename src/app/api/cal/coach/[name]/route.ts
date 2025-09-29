import { sessionsToICalEventData } from "@/lib/sessions-to-ical-event-data";
import { SEAT_KEYS } from "@/schemas/seat";
import { fetchQuery } from "convex/nextjs";
import ical from "ical-generator";
import { NextResponse } from "next/server";
import { api } from "../../../../../../convex/_generated/api";
import { Doc, Id } from "../../../../../../convex/_generated/dataModel";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name: encodedName } = await params;

  const name = decodeURIComponent(encodedName);

  try {
    // Single query for sessions
    const sessions = await fetchQuery(api.sessions.getByCoach, {
      coach: name,
    });

    if (!sessions?.length) {
      return NextResponse.json(
        { message: "No sessions found" },
        { status: 404 }
      );
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

    // Create calendar
    const calendar = ical({ name: `EBC (${name})` });

    // Convert sessions to events using the extracted function
    const events = sessionsToICalEventData(
      sessions,
      usersArray.filter((user): user is Doc<"users"> => user !== null),
      collectionsArray.filter(
        (collection): collection is Doc<"collections"> => collection !== null
      )
    );

    // Add events to calendar
    events.forEach((event) => {
      calendar.createEvent(event);
    });

    return new NextResponse(calendar.toString(), {
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename="${name}-sessions.ics"`,
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
