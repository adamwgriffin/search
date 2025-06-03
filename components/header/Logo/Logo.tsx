import type { NextPage } from "next";
import Link from "next/link";
import { FaHouse } from "react-icons/fa6";
import styles from "./Logo.module.css";

const Logo: NextPage = () => {
  return (
    <Link href="/" className={styles.logo}>
      <FaHouse className={styles.logoImage} />
      wsom
    </Link>
  );
};

export default Logo;
