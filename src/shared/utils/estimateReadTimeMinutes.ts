const WORDS_PER_MINUTE = 200;

export function estimateReadTimeMinutes(text: string): number {
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  if (wordCount === 0) {
    return 1;
  }

  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}
