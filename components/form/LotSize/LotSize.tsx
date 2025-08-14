import type { LotSizeFilter } from "../../../types/filtersTypes";
import { LotSizeValues } from "../../../lib/filter";
import formStyles from "../../../styles/forms.module.css";
import Fieldset from "../../design_system/Fieldset/Fieldset";
import Legend from "../../design_system/Legend/Legend";

export type LotSizeProps = {
  lotSizeMin: number | null;
  onChange?: (lotSizeMin: number | null) => void;
};

const LotSize: React.FC<LotSizeProps> = ({ lotSizeMin, onChange }) => {
  return (
    <Fieldset>
      <Legend>Lot Size</Legend>
      <select
        name="lot-size"
        className={formStyles.select}
        value={Number(lotSizeMin)}
        onChange={(e) => onChange?.(Number(e.target.value))}
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
