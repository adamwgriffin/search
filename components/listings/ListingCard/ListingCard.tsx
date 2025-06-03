import type { NextPage } from "next";
import type { MouseEvent } from "react";
import type { Listing } from "../../../types/listing_types";
import Link from "next/link";
import styles from "./ListingCard.module.css";
import {
  formatPriceFromListing,
  getBathrooms,
  formatSqft,
  cityStateZip
} from "../../../lib/listing_helpers";
import ListingCardImage from "../ListingCardImage/ListingCardImage";

export interface ListingCardProps {
  listing: Listing;
  url: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const ListingCard: NextPage<ListingCardProps> = ({
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
        <div className={styles.bedBathSqft}>
          <div>{listing.beds}bd</div>
          <div>{getBathrooms(listing)}ba</div>
          <div>{formatSqft(listing)} sqft</div>
        </div>
        <div>
          <div>{listing.address.line1}</div>
          <div>{cityStateZip(listing.address)}</div>
        </div>
      </div>
    </Link>
  );
};

export default ListingCard;
