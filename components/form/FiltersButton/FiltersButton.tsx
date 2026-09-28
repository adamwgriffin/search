import clsx from "clsx";
import FiltersIcon from "../../design_system/icons/FiltersIcon/FiltersIcon";
import styles from "./FiltersButton.module.css";

export type FiltersButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    loading?: boolean;
  };

const FiltersButton: React.FC<FiltersButtonProps> = ({
  loading = false,
  ...props
}) => {
  const className = clsx(
    styles.filtersButton,
    loading ? styles.loading : styles.default,
    props.className
  );

  return (
    <button {...props} className={className}>
      <FiltersIcon className={clsx(loading && styles.iconLoading)} />
      Filters
    </button>
  );
};

export default FiltersButton;
