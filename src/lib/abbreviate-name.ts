export function abbreviateName(fullName: string): string {
  // Trim and split on whitespace, removing extra spaces
  const parts = fullName.trim().split(/\s+/);

  if (parts.length === 0) return "";

  // Take the last part as surname
  const surname = parts[parts.length - 1];

  // Take the first letter of the first part as initial
  const initial = parts[0][0].toUpperCase() + ".";

  // Capitalize surname properly (in case input is lowercase)
  const formattedSurname = surname[0].toUpperCase() + surname.slice(1).toLowerCase();

  return `${initial} ${formattedSurname}`;
}
