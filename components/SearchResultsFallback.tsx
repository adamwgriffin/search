import SearchResultsBody from "@/components/SearchResultsBody/SearchResultsBody";
import MenuButtonFallback from "@/components/form/MenuButtonFallback";
import ListingResultsHeaderBody from "@/components/ListingResultsHeaderBody/ListingResultsHeaderBody";

export default function SearchResultsFallback() {
  return (
    <SearchResultsBody>
      <ListingResultsHeaderBody>
        <div></div>
        <MenuButtonFallback label="Sort: Homes" condensed />
      </ListingResultsHeaderBody>
    </SearchResultsBody>
  );
}
