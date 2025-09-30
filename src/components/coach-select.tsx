import { getCoaches } from "@/server-actions/get-coaches";
import { useQuery } from "@tanstack/react-query";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export function CoachSelect({
  coach,
  setCoach,
}: {
  coach: string | undefined;
  setCoach: (coach: string | undefined) => void;
}) {
  const { data: coaches } = useQuery({
    queryKey: ["coaches"],
    queryFn: getCoaches,
  });

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label>Coach</Label>
      <Select
        value={coach}
        onValueChange={(value) => {
          if (value === "undefined") {
            setCoach(undefined);
          } else {
            setCoach(value);
          }
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select coach" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="undefined">No coach</SelectItem>
          {coaches &&
            coaches.map((coach: string) => (
              <SelectItem key={coach} value={coach}>
                {coach}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  );
}
