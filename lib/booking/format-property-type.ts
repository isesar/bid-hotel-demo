export function formatPropertyType(type: string): string {
  if (!type) return "";

  return type.charAt(0).toUpperCase() + type.slice(1);
}
