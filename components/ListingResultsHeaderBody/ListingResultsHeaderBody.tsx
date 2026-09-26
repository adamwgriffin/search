import styles from "./ListingResultsHeaderBody.module.css";

export default function ListingResultsHeaderBody({
  children
}: React.PropsWithChildren) {
  return <div className={styles.listingResultsHeaderBody}>{children}</div>;
}
