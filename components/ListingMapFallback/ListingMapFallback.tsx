import ListingMapBody from "@/components/ListingMapBody/ListingMapBody";
import styles from "./ListingMapFallback.module.css";

export default function ListingMapFallback() {
  return (
    <ListingMapBody>
      <div className={styles.listingMapFallback}></div>
    </ListingMapBody>
  );
}
