import FiltersModal from "../containers/modals/FiltersModal/FiltersModal";
import ListingDetailModal from "../containers/modals/ListingDetailModal/ListingDetailModal";
import LoginOrRegisterModal from "../containers/modals/LoginOrRegisterModal/LoginOrRegisterModal";
import SaveSearchModal from "../containers/modals/SaveSearchModal/SaveSearchModal";

const SearchModals: React.FC = () => (
  <>
    <SaveSearchModal />
    <ListingDetailModal />
    <FiltersModal />
    <LoginOrRegisterModal />
  </>
);

export default SearchModals;
