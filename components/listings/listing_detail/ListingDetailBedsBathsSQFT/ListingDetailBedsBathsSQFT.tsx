import type { ListingDetail } from "../../../../types/listing_types";
import { getBathrooms, formatSqft } from "../../../../lib/listing_helpers";
import styles from "./ListingDetailBedsBathsSQFT.module.css";

export interface ListingDetailBedsBathsSQFTProps {
  listing: ListingDetail;
}

const ListingDetailBedsBathsSQFT: React.FC<ListingDetailBedsBathsSQFTProps> = ({
  listing
}) => {
  return (
    <div className={styles.listingDetailBedsBathsSqft}>
      <div>{listing.beds} Bed</div>
      <div>{getBathrooms(listing)} Bath</div>
      <div>{formatSqft(listing)} sqft</div>
    </div>
  );
};

export default ListingDetailBedsBathsSQFT;
