import FavoriteButton from "../../../containers/FavoriteButton/FavoriteButton";
import type { Listing } from "../../../types/listing_types";
import ListingMainImage from "../listing_detail/ListingMainImage";
import ListingBadges from '../ListingBadges/ListingBadges';
import ListingImageContainer from "../ListingImageContainer/ListingImageContainer";
import ListingImageContainerElements from "../ListingImageContainerElements/ListingImageContainerElements";
import styles from "./ListingCardImage.module.css";

export type ListingCardImageProps = {
  listing: Listing;
};

const ListingCardImage: React.FC<ListingCardImageProps> = ({ listing }) => {
  return (
    <ListingImageContainer>
      <ListingImageContainerElements>
        <ListingBadges listing={listing} />
        <FavoriteButton listingId={listing._id} />
      </ListingImageContainerElements>
      <ListingMainImage
        imageUrl={listing.photoGallery?.[0]?.url}
        latitude={listing.latitude}
        longitude={listing.longitude}
        imageHeightRatio={1 / 1}
        sizes="(max-width: 576px) 100vw, (max-width: 920px) 50vw, (max-width: 1350px) 25vw, 300px"
        className={styles.listingCardImage}
      />
    </ListingImageContainer>
  );
};

export default ListingCardImage;
