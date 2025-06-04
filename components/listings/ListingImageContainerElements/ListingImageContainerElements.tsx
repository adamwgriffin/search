import styles from "./ListingImageContainerElements.module.css";

const ListingImageContainerElements: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <div className={styles.listingImageContainerElements}>
      <div className={styles.elements}>{children}</div>
    </div>
  );
};

export default ListingImageContainerElements;
