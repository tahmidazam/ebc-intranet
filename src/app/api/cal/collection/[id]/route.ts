import { sessionsToICalEventData } from "@/lib/sessions-to-ical-event-data";
import { SEAT_KEYS } from "@/schemas/seat";
import { fetchQuery } from "convex/nextjs";
import ical from "ical-generator";
import { NextResponse } from "next/server";
import { api } from "../../../../../../convex/_generated/api";
import { Doc, Id } from "../../../../../../convex/_generated/dataModel";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const collection = await fetchQuery(api.collections.getById, {
      id: id as Id<"collections">,
    });

    if (!collection) {
      return NextResponse.json(
        { message: "Collection not found" },
        { status: 404 }
      );
    }

    // Single query for sessions
    const sessions = await fetchQuery(api.sessions.getByCollection, {
      collectionId: id as Id<"collections">,
    });

    if (!sessions?.length) {
      return NextResponse.json(
        { message: "No sessions found" },
        { status: 404 }
      );
    }

    // Collect unique IDs in a single pass
    const { userIds } = sessions.reduce(
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
    const usersArray = await Promise.all(
      Array.from(userIds).map((uid) =>
        fetchQuery(api.user.getById, { id: uid as Id<"users"> })
      )
    );

    // Create calendar
    const calendar = ical({
      name: `EBC (${collection.title})`,
    });

    // Convert sessions to events using the extracted function
    const events = sessionsToICalEventData({
      sessions,
      users: usersArray.filter((user): user is Doc<"users"> => user !== null),
      collections: [collection],
    });

    // Add events to calendar
    events.forEach((event) => {
      calendar.createEvent(event);
    });

    return new NextResponse(calendar.toString(), {
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename="${collection.title}-sessions.ics"`,
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
