import { type ReactNode, useState } from "react";
import css from "styled-jsx/css";
import MenuButton from "../../design_system/MenuButton/MenuButton";
import BedsAndBathsContainer from "../../../containers/BedsAndBathsContainer/BedsAndBathsContainer";

const BedsAndBathsMenuButton: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <MenuButton
        label="Beds & Baths"
        open={open}
        className={className}
        onClick={() => setOpen(!open)}
        onClickAway={() => setOpen(false)}
      >
        <BedsAndBathsContainer />
      </MenuButton>
      {styles}
    </>
  );
};

const { className, styles } = css.resolve`
  .menu {
    right: auto;
  }

  /* smallAndUp */
  @media only screen and (min-width: 576px) {
    .menu {
      min-width: 440px;
      padding: 1rem;
    }
  }

  /* largeAndUp */
  @media only screen and (min-width: 992px) {
    .menu {
      right: 0;
    }
  }
`;

export default BedsAndBathsMenuButton;
