import { useSearchParams } from 'next/navigation'
import { useId } from 'react'
import RadioButton from '~/components/design_system/RadioButton/RadioButton'
import { useUpdateSearchParams } from '~/hooks/useUpdateSearchParams'
import RadioButtonGroup from '../../design_system/RadioButtonGroup/RadioButtonGroup'
import styles from './BedsAndBaths.module.css'

export const BedBathValues = ['', '1', '2', '3', '4', '5']

const BedsAndBaths: React.FC = () => {
  // Name needs to be unique because this component is in two places & it won't
  // work right otherwise
  const id = useId()
  const searchParams = useSearchParams()
  const updateSearchParams = useUpdateSearchParams()

  return (
    <fieldset className={styles.bedsAndBaths}>
      <RadioButtonGroup label='Beds'>
        {BedBathValues.map((value) => (
          <RadioButton
            key={`${`beds_min_${id}`}-radio-${value}`}
            name={`beds_min_${id}`}
            label={value === '' ? 'Any' : `${value}+`}
            value={value}
            checked={(searchParams.get('beds_min') ?? '') === value}
            onChange={() => updateSearchParams({ beds_min: value })}
          />
        ))}
      </RadioButtonGroup>
      <RadioButtonGroup label='Baths'>
        {BedBathValues.map((value) => (
          <RadioButton
            key={`${`baths_min_${id}`}-radio-${value}`}
            name={`baths_min_${id}`}
            label={value === '' ? 'Any' : `${value}+`}
            value={value}
            checked={(searchParams.get('baths_min') ?? '') === value}
            onChange={() => updateSearchParams({ baths_min: value })}
          />
        ))}
      </RadioButtonGroup>
    </fieldset>
  )
}

export default BedsAndBaths
