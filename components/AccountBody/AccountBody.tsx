import styles from "./AccountBody.module.css";

const AccountBody: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <main className={styles.accountBody}>{children}</main>;
};

export default AccountBody;
