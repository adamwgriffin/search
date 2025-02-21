import { Fragment } from 'react'
import { PropertyTypesData } from '../../../lib/property_types'
import Fieldset from '../../design_system/Fieldset/Fieldset'
import Legend from '../../design_system/Legend/Legend'
import styles from './PropertyTypes.module.css'
import { useSearchParamsState } from '~/providers/SearchParamsProvider'

const PropertyTypes: React.FC = () => {
  const { searchParamsState, updateSearchParams } = useSearchParamsState()

  const propertyTypes = searchParamsState.property_type?.split(',') ?? []

  return (
    <Fieldset>
      <Legend>Home Type</Legend>
      <div className={styles.propertyType}>
        {PropertyTypesData.map(({ label, id }) => (
          <Fragment key={`property-type-${label}-${id}`}>
            <input
              type='checkbox'
              id={id}
              className={styles.checkbox}
              name={id}
              value={id}
              checked={propertyTypes.includes(id)}
              onChange={(e) => {
                const updatedPropertyTypes = e.target.checked
                  ? propertyTypes.concat(id)
                  : propertyTypes.filter((t) => t !== id)
                updateSearchParams({
                  property_type: updatedPropertyTypes.join(',')
                })
              }}
            />
            <label htmlFor={id} className={styles.label}>
              {label}
            </label>
          </Fragment>
        ))}
      </div>
    </Fieldset>
  )
}

export default PropertyTypes
