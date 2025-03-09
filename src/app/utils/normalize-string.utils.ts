export function normalizeString(value?: string | null): string | undefined {
  if (value === undefined || value === null) {
    return value as undefined;
  }
  return value.trim() === '' ? undefined : value;
}
