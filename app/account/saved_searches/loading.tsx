import styles from "./page.module.css";
import SavedSearchCardLoader from "@/components/SavedSearchCardLoader/SavedSearchCardLoader";

export default async function Loading() {
  return (
    <>
      <h1>Saved Searches</h1>
      <ul className={styles.savedSearchCards}>
        {[...Array(6)].map((_, i) => (
          <li key={i}>
            <SavedSearchCardLoader />
          </li>
        ))}
      </ul>
    </>
  );
}
