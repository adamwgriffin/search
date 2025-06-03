import type { CSSProperties, ReactNode } from "react";
import css from "styled-jsx/css";

type Common = {
  open: boolean;
  children: ReactNode;
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
  const classNames = `menu ${open ? "open" : "closed"} ${
    className ? className : ""
  }`.trim();

  const computedStyles: CSSProperties = {
    left: fitWidth ? "0" : undefined,
    right: alignRight || fitWidth ? "0" : undefined,
    bottom: alignBottom ? "100%" : undefined
  };

  return (
    <>
      <div id={id} className={classNames} style={computedStyles}>
        {children}
      </div>
      <style jsx>{styles}</style>
    </>
  );
};

const styles = css`
  .menu {
    position: absolute;
    transform: none;
    z-index: 2;
    min-width: 6rem;
    border-radius: 6px;
    margin-top: 3px;
    box-shadow:
      0px 9px 12px rgba(0, 0, 0, 0.06),
      0px 3px 16px rgba(0, 0, 0, 0.04),
      0px 5px 6px rgba(0, 0, 0, 0.06);
    background: var(--background);
  }

  .open {
    display: block;
  }

  .closed {
    display: none;
  }
`;

export default MenuDropdown;
