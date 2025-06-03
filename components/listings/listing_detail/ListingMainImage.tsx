import { useCallback, useState } from "react";
import {
  buildSrcSet,
  streetViewImageUrl
} from "../../../lib/listing_image_helpers";

export type ListingMainImageProps = {
  imageUrl: string | undefined;
  latitude: number;
  longitude: number;
  imageHeightRatio: number;
  fallbackImageUrl?: string;
} & React.ImgHTMLAttributes<HTMLImageElement>;

const ListingMainImage: React.FC<ListingMainImageProps> = ({
  imageUrl,
  latitude,
  longitude,
  imageHeightRatio,
  fallbackImageUrl = "/default_listing_image/default_listing_image_1200x1200.jpg",
  alt = "Listing photo",
  ...props
}) => {
  const [imageLoadError, setImageLoadError] = useState(false);

  const handleImageLoadError = useCallback(() => setImageLoadError(true), []);

  if (imageLoadError) {
    return <img src={fallbackImageUrl} alt={alt} {...props} />;
  }

  if (imageUrl) {
    return (
      <img
        srcSet={buildSrcSet(imageUrl, imageHeightRatio)}
        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${imageUrl}`}
        alt={alt}
        onError={handleImageLoadError}
        {...props}
      />
    );
  }

  return (
    <img
      src={streetViewImageUrl(latitude, longitude)}
      alt={alt}
      onError={handleImageLoadError}
      {...props}
    />
  );
};

export default ListingMainImage;
