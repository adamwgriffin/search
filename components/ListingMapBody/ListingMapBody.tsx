import styles from "./ListingMapBody.module.css";

export default function ListingMapBody({ children }: React.PropsWithChildren) {
  return <div className={styles.listingMapBody}>{children}</div>;
}
