import { SessionType } from "@/schemas/session-type";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export function SessionTypeSelect({
  value,
  onValueChange,
}: {
  value: SessionType;
  onValueChange: (value: SessionType) => void;
}) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label>Session Type</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select session type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="water">Water</SelectItem>
          <SelectItem value="land">Land</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
