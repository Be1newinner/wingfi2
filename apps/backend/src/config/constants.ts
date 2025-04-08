export enum IMAGE_TYPES_ENUM {
  AVATAR = "AVATAR",
  PRODUCT = "PRODUCT",
  SLIDER = "SLIDER",
  CATEGORY = "CATEGORY",
}

export const IMAGE_SIZES: Record<
  IMAGE_TYPES_ENUM,
  { width: number; height: number }
> = {
  [IMAGE_TYPES_ENUM.AVATAR]: { width: 256, height: 256 },
  [IMAGE_TYPES_ENUM.PRODUCT]: { width: 1080, height: 1080 },
  [IMAGE_TYPES_ENUM.SLIDER]: { width: 1920, height: 600 },
  [IMAGE_TYPES_ENUM.CATEGORY]: { width: 600, height: 600 },
};

export const IMAGE_TYPES: IMAGE_TYPES_ENUM[] = Object.keys(
  IMAGE_SIZES
) as IMAGE_TYPES_ENUM[];

export const TAX = 0.18;