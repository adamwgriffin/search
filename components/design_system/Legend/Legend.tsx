import type { NextPage } from "next";
import type { ReactNode } from "react";
import styles from "./Legend.module.css";

const Legend: NextPage<{ children: ReactNode }> = ({ children }) => {
  return <legend className={styles.legend}>{children}</legend>;
};

export default Legend;
