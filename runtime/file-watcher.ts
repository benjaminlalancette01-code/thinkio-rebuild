export const defaultWatcherExcludes = [
  "**/thinkio-archive/**",
  "**/archive/**",
  "**/old-versions/**",
  "**/candidate-extraction-piles/**",
  "**/node_modules/**",
  "**/dist/**"
];

export function shouldWatchPath(path: string): boolean {
  return !defaultWatcherExcludes.some((pattern) => {
    const fragment = pattern.replaceAll("**/", "").replaceAll("/**", "");
    return path.includes(fragment);
  });
}

