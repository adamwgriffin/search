import type { ListingAddress } from "../../../../types/listing_types";
import { cityStateZip } from "../../../../lib/listing_helpers";
import styles from "./ListingDetailAddress.module.css";

export type ListingDetailAddressProps = {
  address: ListingAddress;
};

const ListingDetailAddress: React.FC<ListingDetailAddressProps> = ({
  address
}) => {
  return (
    <address className={styles.address}>
      <div className={styles.addressLine1}>{address.line1}</div>
      <div>{cityStateZip(address)}</div>
    </address>
  );
};

export default ListingDetailAddress;
