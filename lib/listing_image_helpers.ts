import {
  GoogleMapsStreetViewURL,
  GoogleStreetViewMaxImageSize
} from "../config/googleMapsOptions";

/**
 * Image size widths to use for <img> srcset attribute. Used to let the browser
 * choose the optimal image for the device.
 */
const ImageSizes = [640, 750, 828, 1080, 1200, 1600, 1920, 2048];

/**
 * Build a url to get a static Google Street View image. The maximum width or
 * height available is only 640px.
 */
export const streetViewImageUrl = (
  latitude: number,
  longitude: number,
  width: number = GoogleStreetViewMaxImageSize,
  height: number = GoogleStreetViewMaxImageSize
) => {
  const url = new URL(GoogleMapsStreetViewURL);
  url.search = new URLSearchParams({
    location: `${latitude},${longitude}`,
    size: `${width}x${height}`,
    // This causes the request to return an http error status code if there is no image for the location
    return_error_code: "true",
    key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!
  }).toString();
  return url.toString();
};

export const buildSrcSet = (
  imagUrl: string,
  ratio: number | undefined = undefined
) => {
  return ImageSizes.map((width) => {
    const dimensions = ratio
      ? `w-${width},h-${Math.round(width / ratio)}`
      : `w-${width}`;
    return `${process.env.NEXT_PUBLIC_IMAGE_URL}${imagUrl}?tr=${dimensions} ${width}w`;
  }).join(", ");
};
