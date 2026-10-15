import MinimalHeader from "@/components/header/MinimalHeader/MinimalHeader";
import AccountBody from "@/components/AccountBody/AccountBody";
import styles from "./page.module.css";
import SavedSearchCardLoader from "@/components/SavedSearchCardLoader/SavedSearchCardLoader";
import ReactQueryClientProvider from "@/providers/ReactQueryClientProvider";

export default async function Loading() {
  return (
    <ReactQueryClientProvider>
      <MinimalHeader />
      <AccountBody>
        <h1>Saved Searches</h1>
        <ul className={styles.savedSearchCards}>
          {[...Array(6)].map((_, i) => (
            <li key={i}>
              <SavedSearchCardLoader />
            </li>
          ))}
        </ul>
      </AccountBody>
    </ReactQueryClientProvider>
  );
}
