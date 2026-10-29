/** Breaks a title after its first comma so headlines can set on two lines. */
export function splitTitle(title: string): string[] {
  const i = title.indexOf(', ');
  return i === -1 ? [title] : [title.slice(0, i + 1), title.slice(i + 2)];
}
