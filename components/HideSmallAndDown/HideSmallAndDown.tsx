import styles from "./HideSmallAndDown.module.css";

const HideSmallAndDown: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  return <span className={styles.screenReaderOnly}>{children}</span>;
};

export default HideSmallAndDown;
