/**
 * KaruviLab (KV) AI Platform v1.0 - Generic Tile Decomposition for OOM Protection
 */

export interface TileBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function generateTiles(
  imageWidth: number,
  imageHeight: number,
  tileSize = 256,
  overlap = 16
): TileBounds[] {
  const tiles: TileBounds[] = [];
  const stride = tileSize - overlap;

  for (let y = 0; y < imageHeight; y += stride) {
    for (let x = 0; x < imageWidth; x += stride) {
      const width = Math.min(tileSize, imageWidth - x);
      const height = Math.min(tileSize, imageHeight - y);
      tiles.push({ x, y, width, height });
    }
  }

  return tiles;
}
