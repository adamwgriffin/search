import styles from "./ListingImageContainer.module.css";

const ListingImageContainer: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  return <div className={styles.listingImageContainer}>{children}</div>;
};

export default ListingImageContainer;
