import type { NextPage } from "next";
import type { FeatureFilters } from "../../../store/filters/filtersTypes";
import type { ChangeEvent } from "react";
import styles from "./Features.module.css";
import formStyles from "../../../styles/forms.module.css";
import { FeatureLabels } from "../../../lib/filter";
import Fieldset from "../../design_system/Fieldset/Fieldset";
import Legend from "../../design_system/Legend/Legend";

export interface FeaturesProps {
  featureFilters: FeatureFilters;
  onChange?: (param: Partial<FeatureFilters>) => void;
}

const Features: NextPage<FeaturesProps> = ({ featureFilters, onChange }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.({ [e.target.name]: e.target.checked });
  };

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
              checked={!!value}
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
