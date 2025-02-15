import type { NextPage } from 'next'
import type { SquareFeetRangeFilters } from '../../../store/filters/filtersTypes'
import styles from './SquareFeet.module.css'
import formStyles from '../../../styles/forms.module.css'
import { NumericFormat } from 'react-number-format'
import Fieldset from '../../design_system/Fieldset/Fieldset'
import Legend from '../../design_system/Legend/Legend'
import InputRangeSeparator from '../../design_system/InputRangeSeparator/InputRangeSeparator'

export interface SquareFeetProps {
  squareFeetRange: SquareFeetRangeFilters
  onChange?: (squareFeetRange: Partial<SquareFeetRangeFilters>) => void
  onFocus?: () => void
  onBlur?: () => void
}

const SquareFeet: NextPage<SquareFeetProps> = ({ squareFeetRange, onChange, onFocus, onBlur }) => {
  return (
    <Fieldset>
      <Legend>Square Feet</Legend>
      <div className={styles.squareFeet}>
        <label
          htmlFor="sqft_min"
          className={formStyles.accessibleLabel}
        >
          Min Square Feet
        </label>
        <NumericFormat
          thousandSeparator=','
          allowNegative={false}
          decimalScale={0}
          value={squareFeetRange.sqftMin}
          onValueChange={(v) => onChange?.({ sqftMin: v.floatValue || null })}
          placeholder='Min'
          className={formStyles.input}
          id='sqft_min'
          autoComplete='off'
          onFocus={onFocus}
          onBlur={onBlur}
          inputMode='numeric'
        />
        <InputRangeSeparator />
        <label
          htmlFor="sqft_max"
          className={formStyles.accessibleLabel}
        >
          Max Square Feet
        </label>
        <NumericFormat
          thousandSeparator=','
          allowNegative={false}
          decimalScale={0}
          value={squareFeetRange.sqftMax}
          onValueChange={(v) => onChange?.({ sqftMax: v.floatValue || null })}
          placeholder='Max'
          className={formStyles.input}
          id='sqft_max'
          autoComplete='off'
          onFocus={onFocus}
          onBlur={onBlur}
          inputMode='numeric'
        />
      </div>
    </Fieldset>
  )
}

export default SquareFeet
