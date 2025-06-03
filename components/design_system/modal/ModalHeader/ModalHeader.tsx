import type { NextPage } from "next";
import styles from "./ModalHeader.module.css";
import CloseIcon from "../../icons/CloseIcon/CloseIcon";

export interface ModalHeaderProps {
  title: string;
  onClose: () => void;
}

const ModalHeader: NextPage<ModalHeaderProps> = ({ title, onClose }) => {
  return (
    <header className={styles.header}>
      <button className={styles.closeButton} onClick={onClose}>
        <CloseIcon />
      </button>
      <h1 className={styles.title}>{title}</h1>
    </header>
  );
};

export default ModalHeader;
