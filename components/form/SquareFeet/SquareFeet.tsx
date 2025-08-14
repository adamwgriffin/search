import type { SquareFeetRangeFilters } from "../../../types/filtersTypes";
import styles from "./SquareFeet.module.css";
import formStyles from "../../../styles/forms.module.css";
import { NumericFormat } from "react-number-format";
import Fieldset from "../../design_system/Fieldset/Fieldset";
import Legend from "../../design_system/Legend/Legend";
import InputRangeSeparator from "../../design_system/InputRangeSeparator/InputRangeSeparator";
import { useRef } from "react";

export type SquareFeetProps = {
  squareFeetRange: SquareFeetRangeFilters;
  onChange?: (squareFeetRange: SquareFeetRangeFilters) => void;
  onFocus?: () => void;
  onBlur?: (squareFeetRange: SquareFeetRangeFilters) => void;
};

const SquareFeet: React.FC<SquareFeetProps> = ({
  squareFeetRange,
  onChange,
  onFocus,
  onBlur
}) => {
  // Using a ref instead of state here because we don't want to re-render each
  // time this value changes. We just need to keep track of the current state so
  // we can pass it to the onBlur callback if that event is triggered.
  const range = useRef<SquareFeetRangeFilters>({
    sqftMin: squareFeetRange.sqftMin ?? null,
    sqftMax: squareFeetRange.sqftMax ?? null
  });

  return (
    <Fieldset>
      <Legend>Square Feet</Legend>
      <div className={styles.squareFeet}>
        <label htmlFor="sqft_min" className={formStyles.accessibleLabel}>
          Min Square Feet
        </label>
        <NumericFormat
          thousandSeparator=","
          allowNegative={false}
          decimalScale={0}
          value={squareFeetRange.sqftMin}
          onValueChange={(v) => {
            range.current = {
              ...range.current,
              sqftMin: v.floatValue || null
            };
            onChange?.(range.current);
          }}
          placeholder="Min"
          className={formStyles.input}
          id="sqft_min"
          autoComplete="off"
          onFocus={onFocus}
          onBlur={() => onBlur?.(range.current)}
          inputMode="numeric"
        />
        <InputRangeSeparator />
        <label htmlFor="sqft_max" className={formStyles.accessibleLabel}>
          Max Square Feet
        </label>
        <NumericFormat
          thousandSeparator=","
          allowNegative={false}
          decimalScale={0}
          value={squareFeetRange.sqftMax}
          onValueChange={(v) => {
            range.current = {
              ...range.current,
              sqftMax: v.floatValue || null
            };
            onChange?.(range.current);
          }}
          placeholder="Max"
          className={formStyles.input}
          id="sqft_max"
          autoComplete="off"
          onFocus={onFocus}
          onBlur={() => onBlur?.(range.current)}
          inputMode="numeric"
        />
      </div>
    </Fieldset>
  );
};

export default SquareFeet;
