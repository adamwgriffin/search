import type { ReactNode } from "react";
import styles from "./Footer.module.css";

export interface FooterProps {
  children: ReactNode;
}

const Footer: React.FC<FooterProps> = ({ children }) => {
  return <div className={styles.footer}>{children}</div>;
};

export default Footer;
