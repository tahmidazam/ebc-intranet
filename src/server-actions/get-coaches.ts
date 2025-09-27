"use server";

import { getGoogleJWT } from "@/lib/get-google-jwt";
import { GoogleSpreadsheet } from "google-spreadsheet";

export async function getCoaches(): Promise<string[]> {
  const jwt = getGoogleJWT();
  const doc = new GoogleSpreadsheet(
    "1pxpYVHKNRl-BzEm0gj-xSN5-Dw8ZhUBA-ho61ygTE3c",
    jwt
  );

  await doc.loadInfo();

  const sheet = doc.sheetsByTitle["Coaches"];

  const csvBuffer = await sheet.downloadAsTSV();
  const decoder = new TextDecoder();
  const csvString = decoder.decode(csvBuffer);

  const rows = csvString.split("\n").slice(1); // Skip header row

  return rows.map((row) => row.split("\t")[0].trim()).filter((name) => name.trim() !== "");
}
