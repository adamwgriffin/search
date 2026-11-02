import clsx from "clsx";
import styles from "./MenuDropdown.module.css";

type Common = {
  open: boolean;
  children: React.ReactNode;
  id?: string;
  className?: string;
  alignBottom?: boolean;
};

type FitWidth = {
  fitWidth?: boolean;
  alignRight?: never;
};

type AlignRight = {
  fitWidth?: never;
  alignRight?: boolean;
};

export type MenuDropdownProps = Common & (FitWidth | AlignRight);

const MenuDropdown: React.FC<MenuDropdownProps> = ({
  open = false,
  children,
  id,
  className,
  alignRight = false,
  alignBottom = false,
  fitWidth = false
}) => {
  const classNames = clsx(
    styles.menu,
    open ? styles.open : styles.closed,
    className
  );

  const computedStyles: React.CSSProperties = {
    left: fitWidth ? "0" : undefined,
    right: alignRight || fitWidth ? "0" : undefined,
    bottom: alignBottom ? "100%" : undefined
  };

  return (
    <div id={id} className={classNames} style={computedStyles}>
      {children}
    </div>
  );
};

export default MenuDropdown;
