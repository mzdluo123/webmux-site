/** Quote a literal argument for the POSIX shell without evaluating user input. */
export function shellArg(value: string): string {
  return /^[a-zA-Z0-9_./-]+$/.test(value) ? value : `'${value.replaceAll("'", "'\\''")}'`;
}
