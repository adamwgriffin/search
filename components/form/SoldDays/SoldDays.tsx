import type { NextPage } from "next";
import type { FiltersState } from "../../../store/filters/filtersTypes";
import formStyles from "../../../styles/forms.module.css";
import Fieldset from "../../design_system/Fieldset/Fieldset";
import Legend from "../../design_system/Legend/Legend";

export interface SoldDaysProps {
  soldInLast: FiltersState["soldInLast"];
  onChange?: (soldDays: Pick<FiltersState, "soldInLast">) => void;
}

const SoldDays: NextPage<SoldDaysProps> = ({ soldInLast, onChange }) => {
  return (
    <Fieldset>
      <Legend>Sold In Last</Legend>
      <select
        className={formStyles.select}
        value={soldInLast || undefined}
        onChange={(e) => onChange?.({ soldInLast: +e.target.value })}
      >
        <option value="7">Week</option>
        <option value="30">Month</option>
        <option value="90">3 Months</option>
        <option value="180">6 Months</option>
        <option value="365">Year</option>
        <option value="730">2 Years</option>
        <option value="1095">3 Years</option>
        <option value="1825">5 Years</option>
      </select>
    </Fieldset>
  );
};

export default SoldDays;
