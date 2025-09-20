import { JWT } from "google-auth-library";

export function getGoogleJWT() {
  return new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL,
    key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
    scopes: [
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/drive.file",
    ],
  });
}
