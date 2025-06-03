import type { NextPage } from "next";
import styles from "./InputRangeSeparator.module.css";

const InputRangeSeparator: NextPage = () => {
  return (
    <span role="presentation" className={styles.inputRangeSeparator}>
      —
    </span>
  );
};

export default InputRangeSeparator;
