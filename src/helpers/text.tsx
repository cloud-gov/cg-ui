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

export function newOrgPathname(currentPath: string, guid: string): string {
  // Capture everything past an org GUID,
  // until you get to another digit (which would be inside the next GUID)
  const guidRegex =
    /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}/;
  const match = currentPath.match(
    /\/orgs\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}\/\D+/
  );
  if (match && match[0]) {
    let newPath = match[0];
    if (newPath !== currentPath) {
      // This means digits were removed
      // Since the next GUID could've started with a-zA-Z,
      // this removes those stragging chars from the previous match.
      newPath = match[0].replace(/[a-zA-Z]+$/, '');
    }
    // replace org GUID with provided one
    return newPath.replace(guidRegex, guid);
  } else {
    // if there's no match, then just replace any GUID with the provided one
    return currentPath.replace(guidRegex, guid);
  }
}
