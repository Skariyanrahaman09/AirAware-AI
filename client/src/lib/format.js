export function valueOrNA(value, suffix = '') {
  if (value === null || value === undefined || (typeof value === 'number' && isNaN(value))) {
    return 'N/A';
  }
  return `${value}${suffix}`;
}
