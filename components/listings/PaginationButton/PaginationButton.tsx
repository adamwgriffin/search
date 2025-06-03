import type { NextPage } from "next";
import type { ReactNode } from "react";
import styles from "./PaginationButton.module.css";

export interface PaginationButtonProps {
  title: string;
  disabled?: boolean;
  children?: ReactNode;
  onClick?: () => void;
}

const PaginationButton: NextPage<PaginationButtonProps> = ({
  title,
  disabled = false,
  children,
  onClick
}) => {
  return (
    <button
      className={styles.paginationButton}
      title={title}
      aria-label={title}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default PaginationButton;
