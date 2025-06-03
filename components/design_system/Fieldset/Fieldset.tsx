import type { NextPage } from "next";
import type { ReactNode } from "react";
import styles from "./Fieldset.module.css";

const Fieldset: NextPage<{ children: ReactNode }> = ({ children }) => {
  return <fieldset className={styles.fieldset}>{children}</fieldset>;
};

export default Fieldset;
