import MenuOpenIcon from "../icons/MenuOpenIcon/MenuOpenIcon";
import OutlinedButton from "../OutlinedButton/OutlinedButton";
import styles from "./ToggleOpenButton.module.css";

export type ToggleOpenButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    open: boolean;
    label: string;
    highlighted?: boolean;
    condensed?: boolean;
    loading?: boolean;
  };

const ToggleOpenButton: React.FC<ToggleOpenButtonProps> = ({
  open = false,
  label,
  highlighted = false,
  condensed = false,
  loading = false,
  ...props
}) => {
  return (
    <OutlinedButton
      highlighted={highlighted || open}
      condensed={condensed}
      className={loading ? styles.buttonLoading : undefined}
      {...props}
    >
      <span className={styles.label}>{label}</span>
      <MenuOpenIcon
        open={open}
        className={loading ? styles.iconLoading : undefined}
      />
    </OutlinedButton>
  );
};

export default ToggleOpenButton;
