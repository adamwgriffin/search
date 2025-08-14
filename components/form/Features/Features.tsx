import { useCallback } from "react";
import formStyles from "../../../styles/forms.module.css";
import Fieldset from "../../design_system/Fieldset/Fieldset";
import Legend from "../../design_system/Legend/Legend";
import styles from "./Features.module.css";
import { type FeatureFilters } from "@/zod_schemas";

export type FeaturesProps = {
  featureFilters: FeatureFilters;
  onChange?: (param: Partial<FeatureFilters>) => void;
};

export type FeatureLabelsType = {
  [key in keyof FeatureFilters]: string;
};

export const FeatureLabels: Readonly<FeatureLabelsType> = Object.freeze({
  waterfront: "Waterfront",
  view: "Views",
  fireplace: "Fireplace",
  basement: "Basement",
  garage: "Garage",
  new_construction: "New Construction",
  pool: "Pool",
  air_conditioning: "Air Conditioning"
});

const Features: React.FC<FeaturesProps> = ({ featureFilters, onChange }) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.({ [e.target.name]: e.target.checked || null });
    },
    [onChange]
  );

  return (
    <Fieldset>
      <Legend>Home Features</Legend>
      <ul className={styles.featureList}>
        {Object.entries(featureFilters).map(([name, value]) => (
          <li key={name}>
            <input
              type="checkbox"
              id={name}
              className={formStyles.checkbox}
              name={name}
              checked={value}
              onChange={handleChange}
            />
            <label htmlFor={name} className={formStyles.inputListLabel}>
              {FeatureLabels[name as keyof typeof FeatureLabels]}
            </label>
          </li>
        ))}
      </ul>
    </Fieldset>
  );
};

export default Features;
