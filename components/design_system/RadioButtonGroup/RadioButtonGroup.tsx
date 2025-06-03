import type { NextPage } from "next";
import type { CountOption } from "../../../types";
import Fieldset from "../Fieldset/Fieldset";
import Legend from "../Legend/Legend";
import RadioButton from "../RadioButton/RadioButton";
import styles from "./RadioButtonGroup.module.css";

export interface RadioButtonGroupProps {
  name: string;
  label: string;
  options: CountOption[];
  onChange?: (value: number) => void;
}

const RadioButtonGroup: NextPage<RadioButtonGroupProps> = ({
  name,
  label,
  options,
  onChange
}) => {
  return (
    <Fieldset>
      <Legend>{label}</Legend>
      <div className={styles.radioButtonGroup}>
        {options.map((o) => (
          <RadioButton
            key={`${name}-radio-${o.value}`}
            name={name}
            {...o}
            onChange={() => onChange?.(o.value)}
          />
        ))}
      </div>
    </Fieldset>
  );
};

export default RadioButtonGroup;
