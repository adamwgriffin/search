import type { ListingDetail } from "../../../../types/listing_types";
import {
  formatPriceFromListing,
  formatSoldDate
} from "../../../../lib/listing_helpers";
import ListingStatusIndicator from "../../ListingStatusIndicator/ListingStatusIndicator";
import ListingDetailImage from "../ListingDetailImage";
import ListingDetailAddress from "../ListingDetailAddress/ListingDetailAddress";
import ListingDetailBedsBathsSQFT from "../ListingDetailBedsBathsSQFT/ListingDetailBedsBathsSQFT";
import Description from "../Description/Description";
import HomeHighlights from "../Highlights/HomeHighlights";
import PropertyDetails from "../PropertyDetails/PropertyDetails";
import OpenHouseList from "../OpenHouseList/OpenHouseList";
import styles from "./ListingDetail.module.css";

export type ListingDetailProps = {
  listing: ListingDetail;
};

const ListingDetail: React.FC<ListingDetailProps> = ({ listing }) => {
  return (
    <div className={styles.listingDetail}>
      <div className={styles.status}>
        <ListingStatusIndicator status={listing.status} />
        {listing.soldDate && formatSoldDate(listing.soldDate)}
      </div>
      <ListingDetailImage listing={listing} />
      <div className={styles.price}>
        {formatPriceFromListing(listing, { displayInterval: true })}
      </div>
      <div className={styles.neighborhood}>{listing.neighborhood}</div>
      <ListingDetailAddress address={listing.address} />
      <ListingDetailBedsBathsSQFT listing={listing} />
      <Description description={listing.description} />
      {listing.openHouses.length ? (
        <OpenHouseList openHouses={listing.openHouses} />
      ) : null}
      <HomeHighlights listing={listing} />
      {listing.propertyDetails && (
        <PropertyDetails propertyDetails={listing.propertyDetails} />
      )}
    </div>
  );
};

export default ListingDetail;
