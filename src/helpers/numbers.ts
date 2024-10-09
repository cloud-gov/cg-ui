import byteSize from 'byte-size';

export function formatInt(int: number): string {
  return int?.toLocaleString('en-US');
}

// Convert a number in bytes to human-readable entities
// See options at https://github.com/75lb/byte-size?tab=readme-ov-file#exp_module_byte-size--byteSize
export function convertBytes(
  bytes: number,
  options: object | undefined = undefined
): { long: string; unit: string; value: string } {
  if (options) return byteSize(bytes, options);
  return byteSize(bytes);
}

export function megaBytesToBytes(mb: number): number {
  return mb * 1000000;
}

// return a human-readable string given number in megabytes
export function formatMb(mb: number): string {
  const result = convertBytes(megaBytesToBytes(mb));
  return `${result.value}${result.unit}`;
}
