import MinimalHeader from "../../../components/header/MinimalHeader/MinimalHeader";
import AccountBody from "../../../components/AccountBody/AccountBody";
import SavedSearchList from "../../../containers/SavedSearchList/SavedSearchList";
import { SearchStateProvider } from "@/providers/SearchStateProvider";

export default function Favorites() {
  return (
    <SearchStateProvider>
      <MinimalHeader />
      <AccountBody>
        <h1>Saved Searches</h1>
        <SavedSearchList />
      </AccountBody>
    </SearchStateProvider>
  );
}
