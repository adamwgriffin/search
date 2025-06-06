import {
  formatPriceFromListing,
  formatSoldDate
} from "../../../../lib/listing_helpers";
import type { ListingDetail } from "../../../../types/listing_types";
import ListingInfo from "../../ListingInfo/ListingInfo";
import Description from "../Description/Description";
import HomeHighlights from "../Highlights/HomeHighlights";
import ListingDetailAddress from "../ListingDetailAddress/ListingDetailAddress";
import ListingDetailImage from "../ListingDetailImage";
import OpenHouseList from "../OpenHouseList/OpenHouseList";
import PropertyDetails from "../PropertyDetails/PropertyDetails";
import styles from "./ListingDetail.module.css";

export type ListingDetailProps = {
  listing: ListingDetail;
};

const ListingDetail: React.FC<ListingDetailProps> = ({ listing }) => {
  return (
    <div className={styles.listingDetail}>
      <ListingDetailImage listing={listing} />
      {listing.soldDate && (
        <div className={styles.soldStatus}>
          Sold on {formatSoldDate(listing.soldDate)}
        </div>
      )}
      <div className={styles.price}>
        {formatPriceFromListing(listing, { displayInterval: true })}
      </div>
      <div className={styles.neighborhood}>{listing.neighborhood}</div>
      <ListingDetailAddress address={listing.address} />
      <ListingInfo listing={listing} bedsLabel=" Bed" bathsLabel=" Bath" />
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
