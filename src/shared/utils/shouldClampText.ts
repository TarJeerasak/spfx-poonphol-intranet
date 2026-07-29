export const CLAMP_TEXT_THRESHOLD = 220;
export const CLAMP_TEXT_THRESHOLD_WITH_IMAGES = 165;
export const CLAMP_TEXT_THRESHOLD_WITHOUT_IMAGES = 440;

export function shouldClampText(text: string, threshold: number = CLAMP_TEXT_THRESHOLD): boolean {
  return text.length > threshold;
}
