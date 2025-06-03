import type { PropertyStatus } from "../../../types/listing_types";
import styles from "./ListingStatusIndicator.module.css";

export type ListingStatusIndicatorProps = {
  status: PropertyStatus;
};

export const StatusLabels = {
  active: "Active",
  pending: "Pending",
  sold: "Sold",
  rented: "Rented"
};

const statusClass = (status: ListingStatusIndicatorProps["status"]) => {
  switch (status) {
    case "active":
      return styles.statusActive;
    case "sold":
    case "rented":
      return styles.statusSold;
    default:
      return styles.status;
  }
};

const ListingStatusIndicator: React.FC<ListingStatusIndicatorProps> = ({
  status
}) => {
  return <div className={statusClass(status)}>{StatusLabels[status]}</div>;
};

export default ListingStatusIndicator;
