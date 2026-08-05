export function lightenHexColor(hex: string, amount: number): string {
  const normalized = hex.trim().replace('#', '');
  const r = parseInt(normalized.substring(0, 2), 16);
  const g = parseInt(normalized.substring(2, 4), 16);
  const b = parseInt(normalized.substring(4, 6), 16);

  const blendChannel = (channel: number): string => {
    const hexValue = Math.round(channel + (255 - channel) * amount).toString(16);
    return hexValue.length === 1 ? `0${hexValue}` : hexValue;
  };

  return `#${blendChannel(r)}${blendChannel(g)}${blendChannel(b)}`;
}
