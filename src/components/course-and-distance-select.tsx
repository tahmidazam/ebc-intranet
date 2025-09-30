import { COURSE_CASES } from "@/schemas/course";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export function CourseAndDistanceSelect({
  course,
  setCourse,
  setDistance,
}: {
  course: string | undefined;
  setCourse: (course: string | undefined) => void;
  setDistance: (distance: number | undefined) => void;
}) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label htmlFor="distance">Course & Distance</Label>
      <Select
        value={course}
        onValueChange={(value) => {
          if (value === "undefined") {
            setCourse(undefined);
            setDistance(undefined);
          } else {
            setCourse(value);
            const courseCase = COURSE_CASES.find(
              (courseCase) => courseCase.label === value
            );
            if (courseCase) {
              setDistance(courseCase.distance);
            }
          }
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Course" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="undefined">No course</SelectItem>
          {COURSE_CASES.map((courseCase) => (
            <SelectItem key={courseCase.label} value={courseCase.label}>
              {courseCase.label} ({courseCase.distance}km)
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
