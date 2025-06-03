import { useAppDispatch } from "../../../hooks/app_hooks";
import { openModal } from "../../../store/application/applicationSlice";
import FiltersIcon from "../../design_system/icons/FiltersIcon/FiltersIcon";
import styles from "./FiltersButton.module.css";

const FiltersButton: React.FC = () => {
  const dispatch = useAppDispatch();

  return (
    <button
      className={styles.filtersButton}
      onClick={() => {
        dispatch(openModal({ modalType: "filters" }));
      }}
    >
      <FiltersIcon />
      Filters
    </button>
  );
};

export default FiltersButton;
