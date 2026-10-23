import styles from "./ListingCardList.module.css";

export type ListingCardListProps = { children: React.ReactNode };

const ListingCardList: React.FC<ListingCardListProps> = ({ children }) => {
  return <ul className={styles.listingCards}>{children}</ul>;
};

export default ListingCardList;
