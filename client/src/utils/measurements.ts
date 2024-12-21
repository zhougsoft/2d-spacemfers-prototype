export const AU_IN_METERS = 149597870700

export const PIXELS_PER_METER = 10
export const METERS_PER_PIXEL = 0.1

export const metersToPixels = (m: number): number => m * PIXELS_PER_METER
export const pixelsToMeters = (px: number): number => px * METERS_PER_PIXEL
