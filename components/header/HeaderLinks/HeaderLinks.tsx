import type { NextPage } from "next";
import Link from "next/link";
import styles from "./HeaderLinks.module.css";

const HeaderLinks: NextPage = () => {
  return (
    <div className={styles.headerLinks}>
      <Link href="#!" className={styles.link}>
        Buy
      </Link>
      <Link href="#!" className={styles.link}>
        Rent
      </Link>
      <Link href="#!" className={styles.link}>
        Mortgage
      </Link>
    </div>
  );
};

export default HeaderLinks;
