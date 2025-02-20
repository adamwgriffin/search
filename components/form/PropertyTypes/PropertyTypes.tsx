import { useSearchParams } from 'next/navigation'
import { Fragment } from 'react'
import { useUpdateSearchParams } from '~/hooks/useUpdateSearchParams'
import {
  PropertyTypesData
} from '../../../lib/property_types'
import Fieldset from '../../design_system/Fieldset/Fieldset'
import Legend from '../../design_system/Legend/Legend'
import styles from './PropertyTypes.module.css'

const PropertyTypes: React.FC= () => {
  const searchParams = useSearchParams()
  const updateSearchParams = useUpdateSearchParams()

  const params = searchParams.get('property_type')?.split(',') ?? []

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
              checked={params.includes(id)}
              onChange={(e) => {
                const updatedPropertyTypes = e.target.checked
                  ? params.concat(id)
                  : params.filter((t) => t !== id)
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
