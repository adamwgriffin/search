import type { NextPage } from "next";
import type { ReactNode } from "react";
import styles from "./ModalBody.module.css";

export interface ModalBodyProps {
  children: ReactNode;
}

const ModalBody: NextPage<ModalBodyProps> = ({ children }) => {
  return <div className={styles.body}>{children}</div>;
};

export default ModalBody;
