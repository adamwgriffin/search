import type { NextPage } from "next";
import type { LotSizeFilter } from "../../../store/filters/filtersTypes";
import { LotSizeValues } from "../../../lib/filter";
import formStyles from "../../../styles/forms.module.css";
import Fieldset from "../../design_system/Fieldset/Fieldset";
import Legend from "../../design_system/Legend/Legend";

export interface LotSizeProps {
  lotSizeMin: number | null;
  onChange?: (lotSizeMin: LotSizeFilter) => void;
}

const LotSize: NextPage<LotSizeProps> = ({ lotSizeMin, onChange }) => {
  return (
    <Fieldset>
      <Legend>Lot Size</Legend>
      <select
        name="lot-size"
        className={formStyles.select}
        value={Number(lotSizeMin)}
        onChange={(e) => onChange?.({ lotSizeMin: +e.target.value })}
      >
        {LotSizeValues.map(({ label, value }) => (
          <option key={value.toString()} value={value}>
            {label}
          </option>
        ))}
      </select>
    </Fieldset>
  );
};

export default LotSize;
