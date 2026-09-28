import clsx from "clsx";
import styles from "./FiltersIcon.module.css";

export type FiltersIconProps = {
  className?: string;
};

const FiltersIcon: React.FC<FiltersIconProps> = ({ className }) => {
  return (
    <svg
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      className={clsx(styles.filtersIcon, className)}
      aria-hidden="true"
      role="presentation"
      focusable="false"
    >
      <path d="M5 8c1.306 0 2.418.835 2.83 2H14v2H7.829A3.001 3.001 0 1 1 5 8zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm6-8a3 3 0 1 1-2.829 4H2V4h6.17A3.001 3.001 0 0 1 11 2zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"></path>
    </svg>
  );
};

export default FiltersIcon;
