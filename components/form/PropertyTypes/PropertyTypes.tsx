import type { NextPage } from "next";
import type {
  PropertyType,
  PropertyTypeConfig
} from "../../../lib/property_types";
import type { ChangeEvent } from "react";
import { Fragment } from "react";
import styles from "./PropertyTypes.module.css";
import Fieldset from "../../design_system/Fieldset/Fieldset";
import Legend from "../../design_system/Legend/Legend";

interface PropertyTypeProps {
  propertyTypes: Readonly<PropertyTypeConfig[]>;
  params: PropertyType[];
  onChange: (updatedPropertyTypes: PropertyType[]) => void;
}

const PropertyTypes: NextPage<PropertyTypeProps> = ({
  propertyTypes,
  params,
  onChange
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>, id: PropertyType) => {
    const updatedPropertyTypes = e.target.checked
      ? params.concat(id)
      : params.filter((t) => t !== id);
    onChange(updatedPropertyTypes);
  };

  return (
    <Fieldset>
      <Legend>Home Type</Legend>
      <div className={styles.propertyType}>
        {propertyTypes.map(({ label, id }) => (
          <Fragment key={`property-type-${label}-${id}`}>
            <input
              type="checkbox"
              id={id}
              className={styles.checkbox}
              name={id}
              value={id}
              checked={params.includes(id)}
              onChange={(e) => handleChange(e, id)}
            />
            <label htmlFor={id} className={styles.label}>
              {label}
            </label>
          </Fragment>
        ))}
      </div>
    </Fieldset>
  );
};

export default PropertyTypes;
