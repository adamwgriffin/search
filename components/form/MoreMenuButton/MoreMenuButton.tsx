import { useState } from "react";
import { useAppDispatch } from "../../../hooks/app_hooks";
import { clearFilters } from "../../../store/filters/filtersSlice";
import { searchWithUpdatedFilters } from "../../../store/listingSearch/listingSearchCommon";
import MenuContainter from "../../design_system/MenuContainter/MenuContainter";
import ToggleOpenButton from "../../design_system/ToggleOpenButton/ToggleOpenButton";
import More from "../../../containers/More/More";
import Footer from "../../design_system/Footer/Footer";
import TextButton from "../../design_system/TextButton/TextButton";
import ContainedButton from "../../design_system/ContainedButton/ContainedButton";
import styles from "./MoreMenuButton.module.css";

const MoreMenuButton: React.FC = () => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);

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
          <TextButton
            onClick={() => {
              dispatch(clearFilters());
              dispatch(searchWithUpdatedFilters());
            }}
          >
            Clear all
          </TextButton>
          <ContainedButton onClick={() => setOpen(false)}>Done</ContainedButton>
        </Footer>
      </div>
    </MenuContainter>
  );
};

export default MoreMenuButton;
