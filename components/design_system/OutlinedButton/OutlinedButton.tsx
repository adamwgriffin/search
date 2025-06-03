import styles from "./OutlinedButton.module.css";

export type OutlinedButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    highlighted?: boolean;
    condensed?: boolean;
    textColor?: string;
  };

const OutlinedButton: React.FC<OutlinedButtonProps> = ({
  highlighted = false,
  condensed = false,
  textColor = "inherit",
  children,
  ...props
}) => {
  return (
    <button
      className={
        highlighted ? styles.outlinedButtonHighlighted : styles.outlinedButton
      }
      style={{
        color: textColor,
        height: condensed ? "30.5938px" : "40px",
        padding: condensed ? "0 .6rem" : "0 .8rem"
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export default OutlinedButton;
