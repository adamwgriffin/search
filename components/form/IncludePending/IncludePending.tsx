import type { NextPage } from "next";
import type { ChangeEvent } from "react";
import Fieldset from "../../design_system/Fieldset/Fieldset";
import formStyles from "../../../styles/forms.module.css";

interface IncludePendingProps {
  includePending: boolean;
  onChange?: (includePending: boolean) => void;
}

const IncludePending: NextPage<IncludePendingProps> = ({
  includePending,
  onChange
}) => {
  return (
    <Fieldset>
      <input
        type="checkbox"
        name="include_pending"
        id="include_pending"
        className={formStyles.checkbox}
        checked={includePending}
        onChange={(e) => onChange?.(e.target.checked)}
      />
      <label htmlFor="include_pending" className={formStyles.inputListLabel}>
        Include Pending
      </label>
    </Fieldset>
  );
};

export default IncludePending;
