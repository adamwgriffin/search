import type { NextPage } from "next";
import styles from "./PageButton.module.css";

export interface PageButtonProps {
  pageNumber: number;
  disabled?: boolean;
  onClick?: () => void;
}

const PageButton: NextPage<PageButtonProps> = ({
  pageNumber,
  disabled = false,
  onClick
}) => {
  return (
    <button
      className={styles.pageButton}
      title={`Page ${pageNumber}`}
      aria-label={`Page ${pageNumber}`}
      disabled={disabled}
      onClick={onClick}
    >
      {pageNumber}
    </button>
  );
};

export default PageButton;
