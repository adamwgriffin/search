import type { SearchTypeOption } from "../../../types/filtersTypes";
import ContentLoader from "react-content-loader";
import SortMenu from "../../form/SortMenu/SortMenu";
import { SearchTypes } from "../../../lib/filter";
import ListingResultsHeaderBody from "@/components/ListingResultsHeaderBody/ListingResultsHeaderBody";

export type ListingResultsHeaderProps = {
  totalListings: number;
  loading: boolean;
  searchType: SearchTypeOption;
};

const totalListingsMessage = (
  totalListings: number,
  searchType: SearchTypeOption
) => {
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

const ListingResultsHeader: React.FC<ListingResultsHeaderProps> = ({
  totalListings,
  loading,
  searchType
}) => {
  return (
    <ListingResultsHeaderBody>
      <div>
        {!loading &&
          totalListings > 0 &&
          totalListingsMessage(totalListings, searchType)}
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
    </ListingResultsHeaderBody>
  );
};

export default ListingResultsHeader;
