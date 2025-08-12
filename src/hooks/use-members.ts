import { getMembers } from "@/actions/get-members";
import { useQuery } from "@tanstack/react-query";

export function useMembers() {
  return useQuery({
    queryKey: ["members"],
    queryFn: getMembers,
  });
}
