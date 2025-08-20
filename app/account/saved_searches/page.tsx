import MinimalHeader from "../../../components/header/MinimalHeader/MinimalHeader";
import AccountBody from "../../../components/AccountBody/AccountBody";
import SavedSearchList from "../../../containers/SavedSearchList/SavedSearchList";
import { SearchStateProvider } from "@/providers/SearchStateProvider";
import { Suspense } from "react";

export default function SavedSearches() {
  return (
    <Suspense>
      <SearchStateProvider>
        <MinimalHeader />
        <AccountBody>
          <h1>Saved Searches</h1>
          <SavedSearchList />
        </AccountBody>
      </SearchStateProvider>
    </Suspense>
  );
}
