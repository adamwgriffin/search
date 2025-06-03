import type { NextPage } from "next";
import { useId } from "react";
import type { CountOption } from "../../../types";
import styles from "./RadioButton.module.css";

export interface RadioButtonProps extends CountOption {
  name: string;
  onChange?: () => void;
}

const RadioButton: NextPage<RadioButtonProps> = ({
  name,
  label,
  value,
  checked,
  onChange
}) => {
  const inputId = `${name}_${value}_${useId()}`;

  return (
    <div className={styles.radioButton}>
      <input
        type="radio"
        name={name}
        id={inputId}
        className={styles.radioButtonInput}
        checked={checked}
        onChange={onChange}
        value={value}
      />
      <label htmlFor={inputId} className={styles.radioButtonLabel}>
        {label}
      </label>
    </div>
  );
};

export default RadioButton;
