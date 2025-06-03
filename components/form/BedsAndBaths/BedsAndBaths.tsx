import type { NextPage } from "next";
import type { BedsAndBathsFilters } from "../../../store/filters/filtersTypes";
import { useId } from "react";
import styles from "./BedsAndBaths.module.css";
import RadioButtonGroup from "../../design_system/RadioButtonGroup/RadioButtonGroup";
import {
  DefaultBedBathCount,
  countOptions,
  RadioButtonGroups
} from "./beds_and_baths_helpers";

export interface BedsAndBathsProps {
  countArr?: number[];
  bedsAndBaths: BedsAndBathsFilters;
  onChange?: (param: Partial<BedsAndBathsFilters>) => void;
}

const BedsAndBaths: NextPage<BedsAndBathsProps> = ({
  countArr = DefaultBedBathCount,
  bedsAndBaths,
  onChange
}) => {
  const id = useId();

  return (
    <fieldset className={styles.bedsAndBaths}>
      {RadioButtonGroups.map(({ param, label }) => (
        <RadioButtonGroup
          key={param}
          // name needs to be unique because this component is in two places & it won't work right otherwise
          name={`${param}_${id}`}
          label={label}
          options={countOptions(param, countArr, bedsAndBaths)}
          onChange={(value) => onChange?.({ [param]: value || null })}
        />
      ))}
    </fieldset>
  );
};

export default BedsAndBaths;
