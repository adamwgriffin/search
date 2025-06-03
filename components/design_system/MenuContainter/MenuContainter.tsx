import { useRef } from "react";
import { useClickAway } from "react-use";
import styles from "./MenuContainter.module.css";

export type MenuContainterProps = React.HTMLAttributes<HTMLDivElement> & {
  onClickAway?: (e: Event) => void;
};

const MenuContainter: React.FC<MenuContainterProps> = ({
  children,
  onClickAway,
  ...props
}) => {
  const ref = useRef(null);

  useClickAway(ref, (e) => onClickAway?.(e));

  return (
    <div ref={ref} className={styles.menuContainter} {...props}>
      {children}
    </div>
  );
};

export default MenuContainter;
