import type { NextPage } from "next";
import styles from "./CloseIcon.module.css";

const CloseIcon: NextPage = () => {
  return (
    <svg
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      role="presentation"
      focusable="false"
      className={styles.closeIcon}
    >
      <path d="m6 6 20 20"></path>
      <path d="m26 6-20 20"></path>
    </svg>
  );
};

export default CloseIcon;
