import type { NextPage } from "next";
import type { MouseEventHandler } from "react";
import styles from "./BoundaryControl.module.css";

export interface BoundaryControlProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

const BoundaryControl: NextPage<BoundaryControlProps> = ({ onClick }) => {
  return (
    <button className={styles.boundaryControl} onClick={onClick}>
      Remove Boundary
    </button>
  );
};

export default BoundaryControl;
