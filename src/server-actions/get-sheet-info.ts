"use server";

import { getGoogleJWT } from "@/lib/get-google-jwt";
import { SheetMember, sheetMemberSchema } from "@/schemas/sheet-member";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { z } from "zod";

export async function getAvailabilitiesFromSheet(
  docId: string,
  sheetTitle: string
): Promise<SheetMember[]> {
  const jwt = getGoogleJWT();
  const doc = new GoogleSpreadsheet(docId, jwt);

  await doc.loadInfo();

  const sheet = doc.sheetsByTitle[sheetTitle];

  const csvBuffer = await sheet.downloadAsTSV();
  const decoder = new TextDecoder();
  const csvString = decoder.decode(csvBuffer);

  const lines = csvString.split("\n");

  const dates = lines[3]
    .split("\t")
    .slice(15)
    .map((line) => line.trim());

  // Remove first 5 rows of matrix:
  lines.splice(0, 5);

  const members = lines.map((line) => {
    const cells = line.split("\t");

    return {
      crsid: cells[1],
      firstName: cells[2],
      lastName: cells[3],
      email: cells[4],
      phone: cells[5],
      sidePreference: cells[6],
      cox: cells[7] === "TRUE",
      novice: cells[8] === "TRUE",
      availabilities: cells
        .slice(15)
        .map((line) => line.trim())
        .reduce((acc, cell, index) => {
          const date = dates[index];
          if (cell !== "") {
            acc[date] = cell;
          }
          return acc;
        }, {} as Record<string, string>),
    };
  });

  const parsedMembers = z.array(sheetMemberSchema).parse(members);

  return parsedMembers;
}
