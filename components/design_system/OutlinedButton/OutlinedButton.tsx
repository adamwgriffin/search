import clsx from "clsx";
import styles from "./OutlinedButton.module.css";

export type OutlinedButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    highlighted?: boolean;
    condensed?: boolean;
  };

const OutlinedButton: React.FC<OutlinedButtonProps> = ({
  highlighted = false,
  condensed = false,
  children,
  ...props
}) => {
  const className = clsx(
    styles.outlinedButton,
    props.className,
    highlighted && styles.highlighted
  );

  return (
    <button
      {...props}
      style={{
        ...props.style,
        height: condensed ? "30.5938px" : "40px",
        padding: condensed ? "0 .6rem" : "0 .8rem"
      }}
      className={className}
    >
      {children}
    </button>
  );
};

export default OutlinedButton;
