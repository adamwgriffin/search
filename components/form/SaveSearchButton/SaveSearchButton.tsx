import clsx from "clsx";
import OutlinedButton from "@/components/design_system/OutlinedButton/OutlinedButton";
import styles from "./SaveSearchButton.module.css";

export type SaveSearchButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    loading?: boolean;
  };

const SaveSearchButton: React.FC<SaveSearchButtonProps> = ({
  loading = false,
  ...props
}) => {
  const className = clsx(
    styles.saveSearchButton,
    loading && styles.loading,
    props.className
  );
  return (
    <OutlinedButton {...props} className={className}>
      Save Search
    </OutlinedButton>
  );
};

export default SaveSearchButton;
