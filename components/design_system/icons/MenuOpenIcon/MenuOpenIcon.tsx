import clsx from "clsx";
import styles from "./MenuOpenIcon.module.css";

export type MenuOpenIconProps = {
  open: boolean;
  className?: string;
};

const MenuOpenIcon: React.FC<MenuOpenIconProps> = ({
  open,
  className = styles.default
}) => {
  const cls = clsx(
    styles.menuOpenIcon,
    className,
    open ? styles.open : styles.closed
  );

  return (
    <svg
      aria-hidden="true"
      className={cls}
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="8"
    >
      <path fillRule="evenodd" d="M10.59.59 6 5.17 1.41.59 0 2l6 6 6-6z" />
    </svg>
  );
};

export default MenuOpenIcon;
