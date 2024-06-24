export function formatOrgRoleName(input: string): string {
  return underscoreToText(input).replace('organization', 'org');
}

export function underscoreToText(input: string): string {
  return input.replace(/_/g, ' ').trim();
}
