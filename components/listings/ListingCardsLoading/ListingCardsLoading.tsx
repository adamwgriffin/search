import ListingCardList from "@/components/listings/ListingCardList/ListingCardList";
import ListingCardLoader from "@/components/listings/ListingCardLoader/ListingCardLoader";

export type ListingCardLoadingProps = {
  cardNumber?: number;
};

const ListingCardsLoading: React.FC<ListingCardLoadingProps> = ({
  cardNumber = 6
}) => {
  return (
    <ListingCardList>
      {[...Array(cardNumber)].map((_, i) => (
        <li key={i}>
          <ListingCardLoader />
        </li>
      ))}
    </ListingCardList>
  );
};

export default ListingCardsLoading;
