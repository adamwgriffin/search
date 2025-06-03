import type { NextPage } from "next";
import SearchButtonIcon from "../../design_system/icons/SearchButtonIcon/SearchButtonIcon";
import styles from "./SearchButton.module.css";

export interface SearchButtonProps {
  onClick?: () => void;
}

const SearchButton: NextPage<SearchButtonProps> = ({ onClick }) => {
  return (
    <button
      className={styles.searchButton}
      type="submit"
      form="search-form"
      value="Submit"
      tabIndex={0}
      aria-label="Search"
      onClick={onClick}
    >
      <SearchButtonIcon />
    </button>
  );
};

export default SearchButton;
