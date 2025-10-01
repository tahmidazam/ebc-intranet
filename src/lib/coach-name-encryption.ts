"use server";

import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

function getKeyFromEnv(): Buffer {
  const hex = process.env.COACH_NAME_ENCRYPTION_KEY;
  if (!hex) {
    throw new Error("Environment variable COACH_NAME_ENCRYPTION_KEY is not set.");
  }
  const key = Buffer.from(hex, "hex");
  if (key.length !== 32) {
    throw new Error("COACH_NAME_ENCRYPTION_KEY must be 32 bytes (64 hex characters).");
  }
  return key;
}

function toBase64url(buf: Buffer): string {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function fromBase64url(s: string): Buffer {
  let str = s.replace(/-/g, "+").replace(/_/g, "/");
  // pad
  while (str.length % 4) str += "=";
  return Buffer.from(str, "base64");
}

export async function encodeName(name: string): Promise<string> {
  const key = getKeyFromEnv();
  const iv = randomBytes(12); // 96-bit IV recommended for GCM
  const cipher = createCipheriv("aes-256-gcm", key, iv);

  const ct = Buffer.concat([cipher.update(Buffer.from(name, "utf8")), cipher.final()]);
  const tag = cipher.getAuthTag();

  const packed = Buffer.concat([iv, tag, ct]);
  return toBase64url(packed);
}

export async function decodeName(token: string): Promise<string> {
  const key = getKeyFromEnv();
  const buf = fromBase64url(token);

  if (buf.length < 28) {
    throw new Error("Invalid token length");
  }

  const iv = buf.subarray(0, 12);
  const tag = buf.subarray(12, 28);
  const ct = buf.subarray(28);

  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);

  const plain = Buffer.concat([decipher.update(ct), decipher.final()]);
  return plain.toString("utf8");
}