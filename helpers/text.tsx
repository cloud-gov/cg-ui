export function underscoreToText(input: string): string {
  return input.replace(/_/g, ' ').trim();
}
