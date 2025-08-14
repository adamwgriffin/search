import { useState } from "react";
import MenuButton from "../../design_system/MenuButton/MenuButton";
import BedsAndBaths from "@/components/form/BedsAndBaths/BedsAndBaths";
import styles from "./BedsAndBathsMenuButton.module.css";

const BedsAndBathsMenuButton: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <MenuButton
      label="Beds & Baths"
      open={open}
      className={styles.menu}
      onClick={() => setOpen(!open)}
      onClickAway={() => setOpen(false)}
    >
      <BedsAndBaths />
    </MenuButton>
  );
};

export default BedsAndBathsMenuButton;
