import type { NextPage } from 'next'
import type { CSSProperties } from 'react'
import type {
  ListingImage,
  ListingLocation,
  ListingImageSizes
} from '../../../lib/types'
import { SyntheticEvent } from 'react'
import { ListingImageSizeEnum } from '../../../lib/constants/listing_constants'

export interface ListingMainImageProps {
  image: ListingImage
  location: ListingLocation
  size?: ListingImageSizes
  style?: CSSProperties
  alt?: string
}

const ListingMainImage: NextPage<ListingMainImageProps> = ({
  image,
  location,
  size = 'small',
  style = {},
  alt = 'Listing image'
}) => {
  // if there are no images available for the listing in the listing service response, we can try and get a static image
  // of the location using the google maps street view api, so that the user will at least have one image of the house
  // to look at instead of a generic placeholder image.
  const getStreetViewImage = () => {
    const url = new URL('https://maps.googleapis.com/maps/api/streetview')
    const { width, height } = ListingImageSizeEnum[size]
    url.search = new URLSearchParams({
      location: `${location.latitude},${location.longitude}`,
      size: `${width}x${height}`,
      // this causes the request to request to return an http error status code if there is no image for the location
      return_error_code: 'true',
      key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!
    }).toString()
    return url.toString()
  }

  const getMainListingImage = () => {
    return image.title === 'NOIMAGE'
      ? getStreetViewImage()
      : image[`${size}_url`]
  }

  // if we receive an http status code for the image response it will trigger the onError event on the image and we can
  // handle it by setting a default placeholder image instead. this is useful for when we are trying to use a google
  // streetview image but none exists for the location we specified. in that case it will return a 400 error and we will
  // fallback to using our default image instead.
  const handleImageOnError = (
    event: SyntheticEvent<HTMLImageElement, Event>
  ) => {
    event.currentTarget.src = `/default_listing_image/default_listing_image_${size}.jpg`
  }

  return (
    <img
      src={getMainListingImage()}
      alt={alt}
      style={style}
      onError={handleImageOnError}
    ></img>
  )
}

export default ListingMainImage