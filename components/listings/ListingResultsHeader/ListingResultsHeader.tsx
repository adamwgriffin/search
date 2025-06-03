import type { NextPage } from "next";
import type {
  SortFilters,
  SearchTypeOption
} from "../../../store/filters/filtersTypes";
import styles from "./ListingResultsHeader.module.css";
import ContentLoader from "react-content-loader";
import SortMenu from "../../form/SortMenu/SortMenu";
import { SearchTypes } from "../../../lib/filter";

export interface ListingResultsHeaderProps {
  totalListings: number;
  listingSearchRunning: boolean;
  sortBy: SortFilters;
  searchType: SearchTypeOption;
  onSortMenuChange: (sortParams: SortFilters) => void;
}

const ListingResultsHeader: NextPage<ListingResultsHeaderProps> = ({
  totalListings,
  listingSearchRunning,
  sortBy,
  searchType,
  onSortMenuChange
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
        {!listingSearchRunning && totalListings > 0 && totalListingsMessage()}
        {listingSearchRunning && (
          <ContentLoader width={"118px"} height={"19px"}>
            <rect x="0" y="0" rx="6px" width="118px" height="19px" />
          </ContentLoader>
        )}
      </div>
      <SortMenu sortBy={sortBy} onChange={onSortMenuChange} />
    </div>
  );
};

export default ListingResultsHeader;
