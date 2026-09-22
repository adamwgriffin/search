import SearchButtonIcon from "../../design_system/icons/SearchButtonIcon/SearchButtonIcon";
import styles from "./SearchButton.module.css";

export type SearchButtonProps = {
  disabled?: boolean;
  onClick?: () => void;
};

const SearchButton: React.FC<SearchButtonProps> = ({ disabled, onClick }) => {
  return (
    <button
      className={styles.searchButton}
      type="submit"
      form="search-form"
      value="Submit"
      tabIndex={0}
      aria-label="Search"
      onClick={onClick}
      disabled={disabled}
    >
      <SearchButtonIcon />
    </button>
  );
};

export default SearchButton;
