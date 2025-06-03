import ContentLoader from "react-content-loader";
import styles from "./SavedSearchCardLoader.module.css";

const SavedSearchCardLoader: React.FC = () => (
  <div className={styles.savedSearchCardLoader}>
    <ContentLoader
      width={"100%"}
      height={"100%"}
      uniqueKey="saved-search-card-loader"
      fill="none"
    >
      <rect x="19" y="16" width="250" height="28" rx="8" />
      <rect x="19" y="64" width="295" height="19" rx="8" />
      <rect x="19" y="98" width="103" height="19" rx="8" />
      <rect x="19" y="128" width="316" height="40" rx="8" />
      <rect x="311" y="182" width="18" height="26" rx="8" />
    </ContentLoader>
  </div>
);

export default SavedSearchCardLoader;
