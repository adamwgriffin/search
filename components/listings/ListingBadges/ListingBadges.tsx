import type { Listing, ListingDetail } from "../../../types/listing_types";
import ListingStatusIndicator from "../ListingStatusIndicator/ListingStatusIndicator";

export type ListingBadgesProps = {
  listing: Listing | ListingDetail;
  showActiveStatus?: boolean;
};

// TODO: Add badges for open houses and new listings
const ListingBadges: React.FC<ListingBadgesProps> = ({
  listing,
  showActiveStatus = false
}) => {
  return (
    <div>
      {listing.status === "active" && !showActiveStatus ? null : (
        <ListingStatusIndicator status={listing.status} />
      )}
    </div>
  );
};

export default ListingBadges;
