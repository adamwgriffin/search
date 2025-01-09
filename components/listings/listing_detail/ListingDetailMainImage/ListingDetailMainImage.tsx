import { type ImgHTMLAttributes, useState } from 'react'
import {
  buildSrcSet,
  streetViewImageUrl
} from '../../../../lib/listing_image_helpers'
import styles from './ListingDetailMainImage.module.css'
import { GoogleStreetViewMaxImageSize } from '../../../../config/googleMapsOptions'

export type ListingDetailMainImageProps = {
  imageUrl: string | undefined
  streetViewLat: number
  streetViewLng: number
  alt?: string
  onClick?: () => void
}

const DesktopImageRatio = 16 / 9
const MobileImageRatio = 1 / 1
const ImageLoadErrorFallbackUrl =
  '/default_listing_image/default_listing_image_full.jpg'
const MobileMediaQuery = '(max-width: 576px)'
const commonImgAttrs: ImgHTMLAttributes<HTMLImageElement> = {
  fetchPriority: 'high',
  className: styles.listingDetailMainImage
}

const ListingDetailMainImage: React.FC<ListingDetailMainImageProps> = ({
  imageUrl,
  streetViewLat,
  streetViewLng,
  alt = 'Listing photo',
  onClick
}) => {
  const [imageLoadError, setImageLoadError] = useState(false)

  const handleImageLoadError = () => setImageLoadError(true)

  if (imageLoadError) {
    return <img src={ImageLoadErrorFallbackUrl} alt={alt} {...commonImgAttrs} />
  }

  if (imageUrl) {
    return (
      <picture>
        <source
          media={MobileMediaQuery}
          srcSet={buildSrcSet(imageUrl, MobileImageRatio)}
        />
        <img
          srcSet={buildSrcSet(imageUrl, DesktopImageRatio)}
          sizes='800px'
          src={imageUrl}
          onClick={onClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              onClick?.()
            }
          }}
          // If there is no image for the location the street view service will
          // return an error status that triggers this
          onError={handleImageLoadError}
          alt={alt}
          tabIndex={0}
          role='button'
          aria-haspopup='dialog'
          {...commonImgAttrs}
        />
      </picture>
    )
  }

  return (
    <picture>
      <source
        media={MobileMediaQuery}
        srcSet={streetViewImageUrl(streetViewLat, streetViewLng)}
      />
      <img
        src={streetViewImageUrl(
          streetViewLat,
          streetViewLng,
          GoogleStreetViewMaxImageSize,
          GoogleStreetViewMaxImageSize / DesktopImageRatio
        )}
        onError={handleImageLoadError}
        alt={alt}
        {...commonImgAttrs}
      />
    </picture>
  )
}

export default ListingDetailMainImage
