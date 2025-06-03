import type { PropertDetailsSection } from "../../../../types/listing_types";
import { Fragment } from "react";
import styles from "./PropertyDetails.module.css";

export type PropertyDetailsProps = {
  propertyDetails: PropertDetailsSection[];
};

const PropertyDetails: React.FC<PropertyDetailsProps> = ({
  propertyDetails
}) => {
  return (
    <>
      <h4>Property Details</h4>
      {propertyDetails.map(({ _id, name, details }) => (
        <Fragment key={_id}>
          <h5 className={styles.sectionName}>{name}</h5>
          <ul className={styles.details}>
            {details.map(({ _id, name, details }) => (
              <li key={_id}>
                <div className={styles.detailsName}>
                  {name}: {details.join(", ")}
                </div>
              </li>
            ))}
          </ul>
        </Fragment>
      ))}
    </>
  );
};

export default PropertyDetails;
