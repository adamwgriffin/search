import SearchField from "@/components/form/SearchField/SearchField";

export default function SearchLocationFallback() {
  return (
    <form name="search-form">
      <SearchField options={[]} loading />
    </form>
  );
}
