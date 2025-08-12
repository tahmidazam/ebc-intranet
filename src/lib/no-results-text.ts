export function noResultsText(
  item: string,
  filter?: string | undefined
): string {
  if (!filter || filter.length === 0) return `No ${item} yet.`;

  return `No results for "${filter}".`;
}
