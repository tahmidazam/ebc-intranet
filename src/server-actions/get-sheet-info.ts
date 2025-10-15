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
    .slice(13)
    .map((line) => line.trim());

  // Remove first 5 rows of matrix:
  lines.splice(0, 5);

  const members = lines.map((line) => {
    const cells = line.split("\t");

    const availabilities = cells
      .slice(13)
      .map((line) => line.trim())
      .reduce((acc, cell, index) => {
        const date = dates[index];
        if (cell !== "") {
          acc[date] = cell.toLowerCase();
        }
        return acc;
      }, {} as Record<string, string>);

    const crsid = cells[1];
    const firstName = cells[2];
    const lastName = cells[3];
    const email = cells[4];
    const phone = cells[5] !== "" ? cells[5] : undefined;
    const degree = cells[6] !== "" ? cells[6] : undefined;
    const degreeYear = cells[7] !== "" ? cells[7] : undefined;
    const side = cells[8] !== "" ? cells[8] : undefined;
    const sidePreference = cells[9];
    const cox = cells[10] === "TRUE";
    const novice = cells[11] === "TRUE";

    const member = {
      crsid,
      firstName,
      lastName,
      email,
      phone,
      degree,
      degreeYear,
      side,
      sidePreference,
      cox,
      novice,
      availabilities,
    };

    console.log(member);

    return member;
  });

  const parsedMembers = z.array(sheetMemberSchema).parse(members);

  return parsedMembers;
}
