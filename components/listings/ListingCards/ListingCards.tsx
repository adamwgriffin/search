import type { Listing } from "../../../types/listing_types";
import ListingCard from "../ListingCard/ListingCard";
import ListingCardList from "@/components/listings/ListingCardList/ListingCardList";

export type ListingCardProps = {
  listings: Listing[];
  onListingCardClick?: (url: string, listingId: string) => void;
  onListingCardMouseEnter?: (listingId: string) => void;
  onListingCardMouseLeave?: (listingId: string) => void;
};

const ListingCards: React.FC<ListingCardProps> = ({
  listings,
  onListingCardClick,
  onListingCardMouseEnter,
  onListingCardMouseLeave
}) => {
  return (
    <ListingCardList>
      {listings.map((listing) => (
        <li key={listing._id}>
          <ListingCard
            listing={listing}
            url={`/listing/${listing.slug}`}
            onClick={() =>
              onListingCardClick?.(`/listing/${listing.slug}`, listing.slug)
            }
            onMouseEnter={() => onListingCardMouseEnter?.(listing._id)}
            onMouseLeave={() => onListingCardMouseLeave?.(listing._id)}
          />
        </li>
      ))}
    </ListingCardList>
  );
};

export default ListingCards;
