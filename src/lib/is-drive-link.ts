export function isDriveLink(url: string): boolean {
  try {
    const parsed = new URL(url);

    // Must be from google.com domain
    if (!parsed.hostname.endsWith("google.com")) return false;

    // Check known Drive URL patterns
    const isFilePattern = /^\/file\/d\/[^/]+/;
    const isOpenPattern = /^\/open/;
    const isFolderPattern = /^\/drive\/folders\/[^/]+/;

    return (
      parsed.hostname === "drive.google.com" &&
      (isFilePattern.test(parsed.pathname) ||
        isOpenPattern.test(parsed.pathname) ||
        isFolderPattern.test(parsed.pathname))
    );
  } catch {
    return false; // not a valid URL at all
  }
}