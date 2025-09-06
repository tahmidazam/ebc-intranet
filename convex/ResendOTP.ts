import { Email } from "@convex-dev/auth/providers/Email";
import { Resend as ResendAPI } from "resend";
import { RandomReader, generateRandomString } from "@oslojs/crypto/random";

export const ResendOTP = Email({
  id: "resend-otp",
  apiKey: process.env.AUTH_RESEND_KEY,
  maxAge: 60 * 15, // 15 minutes
  async generateVerificationToken() {
    const random: RandomReader = {
      read(bytes) {
        crypto.getRandomValues(bytes);
      },
    };

    const alphabet = "0123456789";
    const length = 6;
    return generateRandomString(random, alphabet, length);
  },
  async sendVerificationRequest({ identifier: email, provider, token }) {
    const resend = new ResendAPI(provider.apiKey);
    const { error } = await resend.emails.send({
      from: "EBC Intranet <auth@ebc-intranet.co.uk>",
      to: [email],
      subject: `${token} is your verification code`,
      text: `<html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head><body><h1>EBC Intranet</h1><p>Enter the following code when prompted:</p><p>${token}</p><p>To protect your account, do not share this code.</p></body></html>`,
    });

    if (error) {
      throw new Error(JSON.stringify(error));
    }
    console.log({ email, token });
  },
});
