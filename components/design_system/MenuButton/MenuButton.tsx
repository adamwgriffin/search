import { type ReactNode, useId } from "react";
import MenuContainter from "../MenuContainter/MenuContainter";
import MenuDropdown from "../MenuDropdown/MenuDropdown";
import ToggleOpenButton from "../ToggleOpenButton/ToggleOpenButton";

export type MenuButtonProps = {
  open: boolean;
  label: string;
  alignRight?: boolean;
  alignBottom?: boolean;
  highlighted?: boolean;
  condensed?: boolean;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  onClickAway?: (e: Event) => void;
};

const MenuButton: React.FC<MenuButtonProps> = ({
  label,
  open = false,
  alignRight = false,
  alignBottom = false,
  highlighted = false,
  condensed = false,
  className,
  children,
  onClick,
  onClickAway
}) => {
  const uniqueID = useId();
  const menuId = `buttonMenu-${uniqueID}`;

  return (
    <MenuContainter onClickAway={onClickAway}>
      <ToggleOpenButton
        open={open}
        label={label}
        highlighted={highlighted}
        condensed={condensed}
        role="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={onClick}
      />
      <MenuDropdown
        id={menuId}
        className={className}
        open={open}
        alignRight={alignRight}
        alignBottom={alignBottom}
      >
        {children}
      </MenuDropdown>
    </MenuContainter>
  );
};

export default MenuButton;
