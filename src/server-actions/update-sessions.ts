"use server";

import { formatName } from "@/lib/format-name";
import { getGoogleJWT } from "@/lib/get-google-jwt";
import { format } from "date-fns";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { Doc, Id } from "../../convex/_generated/dataModel";
import { enGB } from "date-fns/locale";
import { formatInTimeZone } from "date-fns-tz";

export async function updateSessions(
  sessions: Doc<"sessions">[],
  users: Doc<"users">[],
  sheetName: string
) {
  const jwt = getGoogleJWT();
  const doc = new GoogleSpreadsheet(
    "1swwFSMeQBNK-EzOVvoa6WPUSmLc1o5qYQ2hhflmnwEw",
    jwt
  );

  await doc.loadInfo();

  const sheet = doc.sheetsByTitle[sheetName];

  await sheet.setHeaderRow([
    "date",
    "time",
    "type",
    "duration",
    "config.",
    "boat",
    "course",
    "distance",
    "outline",
    "coach",
    "cox",
    "stroke",
    "7",
    "6",
    "5",
    "4",
    "3",
    "2",
    "bow",
  ]);

  // Create user map
  const userMap: Record<Id<"users">, string> = {};
  users.forEach((user) => {
    userMap[user._id] = formatName(user) ?? "";
  });

  await sheet.addRows(
    sessions.map((session) => ({
      date: formatInTimeZone(
        session.timestamp,
        "Europe/London",
        "EEE MMM d",
        { locale: enGB }
      ),
      time: formatInTimeZone(
        session.timestamp,
        "Europe/London",
        "HH:mm",
        { locale: enGB }
      ),
      type: session.type,
      duration: session.duration,
      "config.": session.configuration ?? "",
      boat: session.boat ?? "",
      course: session.course ?? "",
      distance: session.distance ?? "",
      outline: session.outline ?? "",
      coach: session.coach ?? "",
      cox: session.cox ? userMap[session.cox] ?? "" : "",
      stroke: session?.stroke ? userMap[session.stroke] ?? "" : "",
      "7": session?.seven ? userMap[session.seven] ?? "" : "",
      "6": session?.six ? userMap[session.six] ?? "" : "",
      "5": session?.five ? userMap[session.five] ?? "" : "",
      "4": session?.four ? userMap[session.four] ?? "" : "",
      "3": session?.three ? userMap[session.three] ?? "" : "",
      "2": session?.two ? userMap[session.two] ?? "" : "",
      bow: session?.bow ? userMap[session.bow] ?? "" : "",
    }))
  );
}
