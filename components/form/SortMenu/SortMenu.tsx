import type {
  SortType,
  SortDirection
} from "../../../types/listing_service_params_types";
import type { SortFilters } from "../../../store/filters/filtersTypes";
import { useState } from "react";
import MenuButton from "../../design_system/MenuButton/MenuButton";
import CheckIcon from "../../design_system/icons/CheckIcon/CheckIcon";
import styles from "./SortMenu.module.css";

export interface SortMenuProps {
  sortBy: SortFilters;
  onChange?: (sortParams: SortFilters) => void;
}

export interface SortTypeLabels {
  label: string;
  type: SortType;
  direction: SortDirection;
}

export const SortTypeLabels: SortTypeLabels[] = [
  {
    label: "Newest",
    type: "listedDate",
    direction: "desc"
  },
  {
    label: "Price (Lo-Hi)",
    type: "listPrice",
    direction: "asc"
  },
  {
    label: "Price (Hi-Lo)",
    type: "listPrice",
    direction: "desc"
  },
  {
    label: "Beds",
    type: "beds",
    direction: "desc"
  },
  {
    label: "Baths",
    type: "baths",
    direction: "desc"
  },
  {
    label: "Square Feet",
    type: "sqft",
    direction: "desc"
  }
];

const getCurrentSortLabel = (sortParams: SortFilters) => {
  return SortTypeLabels.find(
    ({ type, direction }) =>
      type === sortParams.sortBy && direction === sortParams.sortDirection
  )?.label;
};

const SortMenu: React.FC<SortMenuProps> = ({
  sortBy = { sortBy: "listedDate", sortDirection: "desc" },
  onChange
}) => {
  const [open, setOpen] = useState(false);

  return (
    <MenuButton
      open={open}
      label={`Sort: ${getCurrentSortLabel(sortBy)}`}
      condensed
      alignRight
      onClick={() => setOpen(!open)}
      onClickAway={() => setOpen(false)}
    >
      <ul className={styles.menu}>
        {SortTypeLabels.map(({ type, label, direction }) => (
          <li
            key={`${type}-${direction}`}
            onClick={() => {
              setOpen(false);
              onChange?.({ sortBy: type, sortDirection: direction });
            }}
            className={styles.menuItem}
          >
            <div>
              {sortBy.sortBy === type && sortBy.sortDirection == direction && (
                <CheckIcon />
              )}
            </div>
            <div>{label}</div>
          </li>
        ))}
      </ul>
    </MenuButton>
  );
};

export default SortMenu;
