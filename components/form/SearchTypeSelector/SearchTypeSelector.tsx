import type { NextPage } from "next";
import type { SearchTypeOption } from "../../../types/filtersTypes";
import { SearchTypeLabels, SearchTypes } from "../../../lib/filter";
import { Fragment } from "react";
import styles from "./SearchTypeSelector.module.css";
import Fieldset from "../../design_system/Fieldset/Fieldset";

export interface SearchTypeProps {
  searchType: SearchTypeOption;
  onChange?: (searchType: SearchTypeOption) => void;
}

const SearchTypeSelector: NextPage<SearchTypeProps> = ({
  searchType,
  onChange
}) => {
  return (
    <Fieldset>
      <legend className={styles.title}>Search Type</legend>
      <div className={styles.container}>
        {Object.values(SearchTypes).map((value) => {
          return (
            <Fragment key={`search-type-${value}`}>
              <input
                type="radio"
                name={`search-type-${value}`}
                id={`search-type-${value}`}
                className={styles.radio}
                checked={value === searchType}
                value={value}
                onChange={() => onChange?.(value)}
              />
              <label htmlFor={`search-type-${value}`} className={styles.label}>
                {SearchTypeLabels[value]}
              </label>
            </Fragment>
          );
        })}
      </div>
    </Fieldset>
  );
};

export default SearchTypeSelector;
