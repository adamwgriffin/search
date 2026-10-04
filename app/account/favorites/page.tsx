import MinimalHeader from "../../../components/header/MinimalHeader/MinimalHeader";
import AccountBody from "../../../components/AccountBody/AccountBody";
import FavoritesList from "../../../containers/FavoritesList/FavoritesList";
import ListingDetailModal from "../../../containers/modals/ListingDetailModal/ListingDetailModal";
import ReactQueryClientProvider from "@/providers/ReactQueryClientProvider";

export default function Favorites() {
  return (
    <ReactQueryClientProvider>
      <MinimalHeader />
      <AccountBody>
        <h1>Saved Homes</h1>
        <FavoritesList />
      </AccountBody>
      <ListingDetailModal />
    </ReactQueryClientProvider>
  );
}
