import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function DateTimeSelect({
  value,
  setValue,
}: {
  value: Date;
  setValue: (date: Date) => void;
}) {
  const generateDays = () => {
    const days = [];
    for (let i = 1; i <= 31; i++) {
      days.push(i.toString().padStart(2, "0"));
    }
    return days;
  };

  const generateMonths = () => {
    return [
      { value: "01", label: "January" },
      { value: "02", label: "February" },
      { value: "03", label: "March" },
      { value: "04", label: "April" },
      { value: "05", label: "May" },
      { value: "06", label: "June" },
      { value: "07", label: "July" },
      { value: "08", label: "August" },
      { value: "09", label: "September" },
      { value: "10", label: "October" },
      { value: "11", label: "November" },
      { value: "12", label: "December" },
    ];
  };

  const generateYears = () => {
    return ["2025", "2026"];
  };

  const generateHours = () => {
    const hours = [];
    for (let i = 0; i <= 23; i++) {
      hours.push(i.toString().padStart(2, "0"));
    }
    return hours;
  };

  const generateMinutes = () => {
    const minutes = [];
    for (let i = 0; i <= 59; i += 5) {
      minutes.push(i.toString().padStart(2, "0"));
    }
    return minutes;
  };

  const handleDayChange = (day: string) => {
    const newDate = new Date(value);
    newDate.setDate(parseInt(day));
    setValue(newDate);
  };

  const handleMonthChange = (month: string) => {
    const newDate = new Date(value);
    newDate.setMonth(parseInt(month) - 1);
    setValue(newDate);
  };

  const handleYearChange = (year: string) => {
    const newDate = new Date(value);
    newDate.setFullYear(parseInt(year));
    setValue(newDate);
  };

  const handleHourChange = (hour: string) => {
    const newDate = new Date(value);
    newDate.setHours(parseInt(hour));
    setValue(newDate);
  };

  const handleMinuteChange = (minute: string) => {
    const newDate = new Date(value);
    newDate.setMinutes(parseInt(minute));
    setValue(newDate);
  };

  return (
    <>
      <div className="flex flex-col gap-2 w-full">
        <Label>Day</Label>
        <Select
          value={value.getDate().toString().padStart(2, "0")}
          onValueChange={handleDayChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Day" />
          </SelectTrigger>
          <SelectContent>
            {generateDays().map((day) => (
              <SelectItem key={day} value={day}>
                {day}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <Label>Month</Label>
        <Select
          value={(value.getMonth() + 1).toString().padStart(2, "0")}
          onValueChange={handleMonthChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            {generateMonths().map((month) => (
              <SelectItem key={month.value} value={month.value}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <Label>Year</Label>
        <Select
          value={value.getFullYear().toString()}
          onValueChange={handleYearChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {generateYears().map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <Label>Hour</Label>
        <Select
          value={value.getHours().toString().padStart(2, "0")}
          onValueChange={handleHourChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Hour" />
          </SelectTrigger>
          <SelectContent>
            {generateHours().map((hour) => (
              <SelectItem key={hour} value={hour}>
                {hour}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <Label>Minute</Label>
        <Select
          value={(Math.round(value.getMinutes() / 5) * 5)
            .toString()
            .padStart(2, "0")}
          onValueChange={handleMinuteChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Minute" />
          </SelectTrigger>
          <SelectContent>
            {generateMinutes().map((minute) => (
              <SelectItem key={minute} value={minute}>
                {minute}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
