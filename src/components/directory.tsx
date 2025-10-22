import { formatName } from "@/lib/format-name";
import { useMemo } from "react";
import { Doc } from "../../convex/_generated/dataModel";

export function Directory({ allUsers }: { allUsers: Doc<"users">[] }) {
  const grouped = useMemo(() => {
    // Step 1: map to { name, email, surname }
    const users = allUsers.map((user) => {
      const name = formatName(user) ?? "Unknown User";
      const parts = name.trim().split(" ");
      const surname = parts[parts.length - 1]; // last word
      return { name, email: user.email.replaceAll("@cam.ac.uk", ""), surname };
    });

    // Step 2: sort alphabetically by surname
    users.sort((a, b) => a.surname.localeCompare(b.surname));

    // Step 3: group by first letter of surname
    const groupedUsers = users.reduce<Record<string, typeof users>>(
      (acc, user) => {
        const firstLetter = user.surname[0]?.toUpperCase() ?? "#";
        if (!acc[firstLetter]) acc[firstLetter] = [];
        acc[firstLetter].push(user);
        return acc;
      },
      {}
    );

    return groupedUsers;
  }, [allUsers]);

  return (
    <div>
      {Object.entries(grouped)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([letter, users]) => (
          <div key={letter} className="flex flex-col first:pt-0 pt-4">
            <div
              className="border-b py-2 px-4 flex justify-between sticky bg-background z-10"
              style={{
                top: "calc(env(safe-area-inset-top) + 56px)",
              }}
            >
              <h2 className="whitespace-nowrap font-semibold text-sm">
                {letter}
              </h2>
            </div>

            <div>
              {users.map((user) => (
                <div
                  key={user.email}
                  className="flex items-center justify-between hover:bg-muted/50 border-b py-2 px-4"
                >
                  <p className="flex-1 whitespace-nowrap truncate">
                    {user.name}
                  </p>
                  <p className="text-muted-foreground text-sm ml-4 whitespace-nowrap text-right">
                    {user.email}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}
