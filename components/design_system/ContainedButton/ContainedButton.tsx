import styles from "./ContainedButton.module.css";

export type ContainedButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    textColor?: string;
    backgroundColor?: string;
  };

const ContainedButton: React.FC<ContainedButtonProps> = ({
  children,
  textColor,
  backgroundColor,
  ...props
}) => {
  return (
    <button
      className={styles.containedButton}
      style={{ color: textColor, backgroundColor: backgroundColor }}
      {...props}
    >
      {children}
    </button>
  );
};

export default ContainedButton;
