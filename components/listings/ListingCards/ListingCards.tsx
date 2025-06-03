import type { Listing } from "../../../types/listing_types";
import ListingCard from "../ListingCard/ListingCard";
import ListingCardLoader from "../ListingCardLoader/ListingCardLoader";
import styles from "./ListingCards.module.css";

export type ListingCardProps = {
  listings: Listing[];
  listingSearchRunning: boolean;
  onListingCardClick: (url: string, listingId: string) => void;
  onListingCardMouseEnter?: (listingId: string) => void;
  onListingCardMouseLeave?: (listingId: string) => void;
};

const ListingCards: React.FC<ListingCardProps> = ({
  listings,
  listingSearchRunning,
  onListingCardClick,
  onListingCardMouseEnter,
  onListingCardMouseLeave
}) => {
  if (listingSearchRunning) {
    return (
      <ul className={styles.listingCards}>
        {[...Array(6)].map((_, i) => (
          <li key={i}>
            <ListingCardLoader />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className={styles.listingCards}>
      {listings.map((listing) => (
        <li key={listing._id}>
          <ListingCard
            listing={listing}
            url={`/listing/${listing.slug}`}
            onClick={() =>
              onListingCardClick(`/listing/${listing.slug}`, listing.slug)
            }
            onMouseEnter={() => onListingCardMouseEnter?.(listing._id)}
            onMouseLeave={() => onListingCardMouseLeave?.(listing._id)}
          />
        </li>
      ))}
    </ul>
  );
};

export default ListingCards;
