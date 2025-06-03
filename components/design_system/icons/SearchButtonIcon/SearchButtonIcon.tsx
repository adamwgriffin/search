import type { NextPage } from "next";
import styles from "./SearchButtonIcon.module.css";

const SearchButtonIcon: NextPage = () => {
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      className={styles.searchButtonIcon}
      viewBox="0 0 1024 1024"
    >
      <path d="M661.007 600.668l195.358 195.358c16.662 16.662 16.662 43.677 0 60.34s-43.677 16.662-60.34 0l-195.358-195.358c-110.194 81.116-266.086 71.816-365.802-27.899-109.972-109.972-109.972-288.271 0-398.243s288.271-109.972 398.243 0c99.715 99.715 109.015 255.608 27.899 365.802v0zM596.905 596.905c89.977-89.977 89.977-235.858 0-325.835s-235.858-89.977-325.835 0c-89.977 89.977-89.977 235.858 0 325.835s235.858 89.977 325.835 0z"></path>
    </svg>
  );
};

export default SearchButtonIcon;
