import styles from "./TextButton.module.css";

const TextButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  ...props
}) => {
  return (
    <button className={styles.textButton} {...props}>
      {children}
    </button>
  );
};

export default TextButton;
