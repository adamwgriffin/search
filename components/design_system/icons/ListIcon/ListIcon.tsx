import type { NextPage } from "next";
import styles from "./ListIcon.module.css";

const ListIcon: NextPage = () => {
  return (
    <svg
      role="img"
      aria-label=""
      aria-hidden="true"
      className={styles.listIcon}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M10.699 9.942v-2.66h15.86v2.66H10.7zm0 7.348v-2.66h15.86v2.66H10.7zm0 7.348v-2.66h15.86v2.66H10.7zM5.32 7.278h2.66v2.66H5.32v-2.66zm0 7.352h2.66v2.66H5.32v-2.66zm0 7.351h2.66v2.66H5.32v-2.66z"></path>
    </svg>
  );
};

export default ListIcon;
