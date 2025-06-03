import type { Listing } from "../../../types/listing_types";
import {
  formatPriceFromListing,
  ShortCurrencyFormat,
  getBathrooms,
  formatSqft,
  cityStateZip
} from "../../../lib/listing_helpers";
import styles from "./ListingMarkerContent.module.css";
import Link from "next/link";
import ListingImageContainer from "../../listings/ListingImageContainer/ListingImageContainer";
import ListingImageContainerElements from "../../listings/ListingImageContainerElements/ListingImageContainerElements";
import FavoriteButton from "../../../containers/FavoriteButton/FavoriteButton";
import ListingMainImage from "../../listings/listing_detail/ListingMainImage";

export type ListingMarkerContentProps = {
  listing: Listing;
  link: string;
  highlighted?: boolean;
};

const ListingMarkerContent: React.FC<ListingMarkerContentProps> = ({
  listing,
  link,
  highlighted = false
}) => {
  const priceAbbreviated = formatPriceFromListing(listing, {
    numberFormatOptions: ShortCurrencyFormat,
    displayInterval: false
  });
  const listingMarkerClassName = highlighted
    ? styles.listingMarkerHighlighted
    : styles.listingMarker;

  return (
    // We're only using a link here so that we can change the color of the
    // marker depending on whether it has been visited in the browser history.
    // The actual action taken when clicking the link is handled
    // programmatically, which is why we're using preventDefault.
    <Link
      href={link}
      className={styles.link}
      onClick={(e) => e.preventDefault()}
    >
      <div className={listingMarkerClassName}>
        <div className={styles.icon}>{priceAbbreviated}</div>
        <div className={styles.popup}>
          <ListingImageContainer>
            <ListingImageContainerElements>
              <FavoriteButton listingId={listing._id} />
            </ListingImageContainerElements>
            <ListingMainImage
              imageUrl={listing.photoGallery?.[0]?.url}
              imageHeightRatio={16 / 9}
              // This chooses a size from the img srcSet that most closely
              // matches the 14rem width of the popup, accounting for device
              // pixel density
              sizes="14rem"
              latitude={listing.latitude}
              longitude={listing.longitude}
              className={styles.listingMarkerImage}
              fallbackImageUrl="/default_listing_image/default_listing_image_small.jpg"
            />
          </ListingImageContainer>
          <div className={styles.details}>
            <div className={styles.price}>
              {formatPriceFromListing(listing)}
            </div>
            <div className={styles.bedBathSqft}>
              <div>{listing.beds}bd</div>
              <div>{getBathrooms(listing)}ba</div>
              <div>{formatSqft(listing)} sqft</div>
            </div>
            <div className={styles.address}>
              <div className={styles.addressLine1}>{listing.address.line1}</div>
              <div className={styles.addressLine2}>
                {cityStateZip(listing.address)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ListingMarkerContent;
