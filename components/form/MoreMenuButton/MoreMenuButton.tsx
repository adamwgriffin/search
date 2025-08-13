import { useState } from "react";
import { useSearchState } from "~/providers/SearchStateProvider";
import More from "../../../containers/More/More";
import ContainedButton from "../../design_system/ContainedButton/ContainedButton";
import Footer from "../../design_system/Footer/Footer";
import MenuContainter from "../../design_system/MenuContainter/MenuContainter";
import TextButton from "../../design_system/TextButton/TextButton";
import ToggleOpenButton from "../../design_system/ToggleOpenButton/ToggleOpenButton";
import styles from "./MoreMenuButton.module.css";

const MoreMenuButton: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { clearFilters } = useSearchState();

  return (
    <MenuContainter onClickAway={() => setOpen(false)}>
      <ToggleOpenButton
        label="More"
        role="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="moreMenuButtonMenu"
        open={open}
        onClick={() => setOpen(!open)}
      />
      <div
        id="moreMenuButtonMenu"
        role="menu"
        className={open ? styles.menuOpen : styles.menuClosed}
      >
        <div className={styles.content}>
          <More />
        </div>
        <Footer>
          <TextButton onClick={clearFilters}>Clear all</TextButton>
          <ContainedButton onClick={() => setOpen(false)}>Done</ContainedButton>
        </Footer>
      </div>
    </MenuContainter>
  );
};

export default MoreMenuButton;
