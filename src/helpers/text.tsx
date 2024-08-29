export function camelToSnakeCase(input: string): string {
  function replacer(match: string) {
    return `_${match.toLowerCase()}`;
  }
  return input.replace(/[A-Z]/g, replacer);
}

export function formatOrgRoleName(input: string): string {
  return underscoreToText(input).replace('organization', 'org');
}

export function underscoreToText(input: string): string {
  return input.replace(/_/g, ' ').trim();
}

export function emailIsValid(text: string): boolean {
  /* This is the same regex as W3's for email input types:
  https://www.w3.org/TR/2012/WD-html-markup-20121025/input.email.html#form.data.emailaddress_xref2 */
  const rgx = new RegExp(
    '^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$'
  );
  return rgx.test(text);
}

export function pluralize(text: string, count: number): string {
  return `${text}${count != 1 && count != -1 ? 's' : ''}`;
}
