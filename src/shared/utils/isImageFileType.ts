const IMAGE_FILE_TYPES = ['JPG', 'JPEG', 'PNG', 'GIF', 'WEBP', 'BMP', 'SVG', 'TIF', 'TIFF', 'HEIC'];

export function isImageFileType(fileType: string): boolean {
  return IMAGE_FILE_TYPES.indexOf(fileType.toUpperCase()) !== -1;
}
