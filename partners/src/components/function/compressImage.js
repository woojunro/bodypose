import imageCompression from 'browser-image-compression';

const compressImage = async (
  image,
  maxSizeMB = Number.POSITIVE_INFINITY,
  maxWidthOrHeight = 1080,
  initialQuality = 1
) => {
  const compressed = await imageCompression(image, {
    maxSizeMB,
    maxWidthOrHeight,
    initialQuality,
  });

  return new File([compressed], compressed.name, { type: compressed.type });
};

export const compressThumbnailPhoto = photo => {
  return compressImage(photo, 0.04, 500, 0.8);
};

export const compressOriginalPhoto = photo => {
  if (photo.size <= 150 * 1024) return photo;
  return compressImage(photo, 0.2, 1080, 0.8);
};
