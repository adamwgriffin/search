import MinimalHeader from "../../../components/header/MinimalHeader/MinimalHeader";
import AccountBody from "../../../components/AccountBody/AccountBody";
import SavedSearchList from "../../../containers/SavedSearchList/SavedSearchList";

export default function Favorites() {
  return (
    <>
      <MinimalHeader />
      <AccountBody>
        <h1>Saved Searches</h1>
        <SavedSearchList />
      </AccountBody>
    </>
  );
}
