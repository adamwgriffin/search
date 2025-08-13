import { useId } from "react";
import RadioButton from "~/components/design_system/RadioButton/RadioButton";
import { useSearchState } from "~/providers/SearchStateProvider";
import RadioButtonGroup from "../../design_system/RadioButtonGroup/RadioButtonGroup";
import styles from "./BedsAndBaths.module.css";

export const BedBathValues = [0, 1, 2, 3, 4, 5];

const BedsAndBaths: React.FC = () => {
  // Name needs to be unique because this component is in two places & it won't
  // work right otherwise
  const id = useId();
  const { searchState, setSearchState } = useSearchState();

  return (
    <fieldset className={styles.bedsAndBaths}>
      <RadioButtonGroup label="Beds">
        {BedBathValues.map((value) => (
          <RadioButton
            key={`${`beds_min_${id}`}-radio-${value}`}
            name={`beds_min_${id}`}
            label={value === 0 ? "Any" : `${value}+`}
            value={value}
            checked={(searchState.beds_min ?? 0) === value}
            onChange={() => setSearchState({ beds_min: value })}
          />
        ))}
      </RadioButtonGroup>
      <RadioButtonGroup label="Baths">
        {BedBathValues.map((value) => (
          <RadioButton
            key={`${`baths_min_${id}`}-radio-${value}`}
            name={`baths_min_${id}`}
            label={value === 0 ? "Any" : `${value}+`}
            value={value}
            checked={(searchState.baths_min ?? 0) === value}
            onChange={() => setSearchState({ baths_min: value })}
          />
        ))}
      </RadioButtonGroup>
    </fieldset>
  );
};

export default BedsAndBaths;
