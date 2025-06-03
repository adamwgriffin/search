import Link from "next/link";
import type { MouseEvent } from "react";
import {
  cityStateZip,
  formatPriceFromListing
} from "../../../lib/listing_helpers";
import type { Listing } from "../../../types/listing_types";
import ListingCardImage from "../ListingCardImage/ListingCardImage";
import ListingInfo from "../ListingInfo/ListingInfo";
import styles from "./ListingCard.module.css";

export type ListingCardProps = {
  listing: Listing;
  url: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  url,
  onClick,
  onMouseEnter,
  onMouseLeave
}) => {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    onClick?.();
  };

  return (
    <Link
      href={url}
      className={styles.link}
      onClick={handleClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <ListingCardImage listing={listing} />
      <div className={styles.details}>
        <div className={styles.price}>
          {formatPriceFromListing(listing, { displayInterval: true })}
        </div>
        <ListingInfo listing={listing} />
        <div>
          <div>{listing.address.line1}</div>
          <div>{cityStateZip(listing.address)}</div>
        </div>
      </div>
    </Link>
  );
};

export default ListingCard;
