export const CLAMP_TEXT_THRESHOLD = 220;

export function shouldClampText(text: string, threshold: number = CLAMP_TEXT_THRESHOLD): boolean {
  return text.length > threshold;
}
