import type { SearchTypeOption } from "../../../types/filtersTypes";
import styles from "./ListingResultsHeader.module.css";
import ContentLoader from "react-content-loader";
import SortMenu from "../../form/SortMenu/SortMenu";
import { SearchTypes } from "../../../lib/filter";

export interface ListingResultsHeaderProps {
  totalListings: number;
  loading: boolean;
  searchType: SearchTypeOption;
}

const ListingResultsHeader: React.FC<ListingResultsHeaderProps> = ({
  totalListings,
  loading,
  searchType
}) => {
  const totalListingsMessage = () => {
    const plural = totalListings > 1;
    let searchedFor;
    switch (searchType) {
      case SearchTypes.Buy:
        searchedFor = plural ? "Homes" : "Home";
        break;
      case SearchTypes.Rent:
        searchedFor = plural ? "Rentals" : "Rental";
        break;
      case SearchTypes.Sold:
        searchedFor = plural ? "Sold Homes" : "Sold Home";
        break;
    }
    return `${totalListings.toLocaleString()} ${searchedFor}`;
  };

  return (
    <div className={styles.listingResultsHeader}>
      <div>
        {!loading && totalListings > 0 && totalListingsMessage()}
        {loading && (
          <ContentLoader
            uniqueKey="total-listings-loader"
            width={"118px"}
            height={"19px"}
          >
            <rect x="0" y="0" rx="6px" width="118px" height="19px" />
          </ContentLoader>
        )}
      </div>
      <SortMenu />
    </div>
  );
};

export default ListingResultsHeader;
