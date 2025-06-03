import type { Listing, ListingDetail } from "../../../types/listing_types";
import styles from "./ListingInfo.module.css";
import {
  getBathrooms,
  formatSqft,
  formatLotSize
} from "../../../lib/listing_helpers";

export type ListingInfoProps = {
  listing: Listing | ListingDetail;
  bedsLabel?: string;
  bathsLabel?: string;
};

const ListingInfo: React.FC<ListingInfoProps> = ({
  listing,
  bedsLabel = "bd",
  bathsLabel = "ba"
}) => {
  if (listing.propertyType === "land") {
    return (
      <div className={styles.listingCardInfo}>
        <div>{formatLotSize(listing.lotSize)} lot</div>
      </div>
    );
  }
  return (
    <div className={styles.listingCardInfo}>
      <div>
        {listing.beds}
        {bedsLabel}
      </div>
      <div>
        {getBathrooms(listing)}
        {bathsLabel}
      </div>
      <div>{formatSqft(listing)} sqft</div>
    </div>
  );
};

export default ListingInfo;
