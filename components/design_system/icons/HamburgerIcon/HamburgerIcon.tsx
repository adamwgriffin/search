import type { NextPage } from "next";
import styles from "./HamburgerIcon.module.css";

export interface HamburgerIconProps {
  active?: boolean;
  onClick?: () => void;
}

const HamburgerIcon: NextPage<HamburgerIconProps> = ({ active, onClick }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={active ? styles.hamburgerIconActive : styles.hamburgerIcon}
      onClick={onClick}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className={styles.top}
        d="m 30,33 h 40 c 3.722839,0 7.5,3.126468 7.5,8.578427 0,5.451959 -2.727029,8.421573 -7.5,8.421573 h -20"
      />
      <path className={styles.middle} d="m 30,50 h 40" />
      <path
        className={styles.bottom}
        d="m 70,67 h -40 c 0,0 -7.5,-0.802118 -7.5,-8.365747 0,-7.563629 7.5,-8.634253 7.5,-8.634253 h 20"
      />
    </svg>
  );
};

export default HamburgerIcon;
