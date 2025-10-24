export function validateAvailability(input: string): boolean {
  // Trim whitespace and normalize
  const trimmed = input.trim();

  // Allow simple "busy" or "free"
  if (trimmed === "busy" || trimmed === "free") return true;

  // Define a regex for valid 24-hour times (00:00–23:59)
  const time = "(?:[01]\\d|2[0-3]):[0-5]\\d";

  // Each valid segment can be:
  // - -HH:MM (busy until)
  // - HH:MM- (busy from)
  // - HH:MM-HH:MM (busy between)
  const segment = `(?:-${time}|${time}-|${time}-${time})`;

  // Combine into full pattern allowing comma+space separation
  const pattern = new RegExp(`^${segment}(?:,\\s*${segment})*$`);

  return pattern.test(trimmed);
}
