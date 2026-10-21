import Link from "next/link";
import { FaHouse } from "react-icons/fa6";
import { SearchPathname } from "@/config";
import styles from "./Logo.module.css";

const Logo: React.FC = () => {
  return (
    <Link href={SearchPathname} className={styles.logo}>
      <FaHouse className={styles.logoImage} />
      wsom
    </Link>
  );
};

export default Logo;
