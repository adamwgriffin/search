import styles from "./ListingImageContainerElements.module.css";

const ListingImageContainerElements: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return <div className={styles.listingImageContainerElements}>{children}</div>;
};

export default ListingImageContainerElements;
