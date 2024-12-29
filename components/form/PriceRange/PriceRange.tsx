import type { PriceRangeFilters } from '../../../store/filters/filtersTypes'
import { type KeyboardEvent, useState } from 'react'
import Price from '../Price/Price'
import InputRangeSeparator from '../../design_system/InputRangeSeparator/InputRangeSeparator'
import styles from './PriceRange.module.css'

export type PriceRangeProps = {
  priceRange: PriceRangeFilters
  onFocus?: () => void
  onBlur?: () => void
  onChange?: (priceRange: Partial<PriceRangeFilters>) => void
  onMenuItemSelected?: (priceRange: Partial<PriceRangeFilters>) => void
}

const PriceRange: React.FC<PriceRangeProps> = ({
  priceRange,
  onFocus,
  onBlur,
  onChange,
  onMenuItemSelected
}) => {
  const [minOpen, setMinOpen] = useState(false)
  const [maxOpen, setMaxOpen] = useState(false)

  const handleMinFocus = () => {
    onFocus?.()
    setMaxOpen(false)
    setMinOpen(true)
  }

  const handleMaxFocus = () => {
    onFocus?.()
    setMinOpen(false)
    setMaxOpen(true)
  }

  // We want to prevent the escape key event from bubbling when a menu is open
  // because otherwise the mobile filters modal will receive it and close the
  // modal when what we really want to close the menu instead
  const checkPropogationForKey = (e: KeyboardEvent<HTMLInputElement>, open: boolean) => {
    if (e.key === 'Escape' && open) {
      e.stopPropagation()
    }
  }

  return (
    <fieldset className={styles.price}>
      <legend className={styles.legend}>Price Range</legend>

      <Price
        label='Min Price'
        placeholder='Min'
        price={priceRange.priceMin}
        menuOpen={minOpen}
        onFocus={handleMinFocus}
        onBlur={onBlur}
        onClickAway={() => setMinOpen(false)}
        onKeyUp={(e) => {
          checkPropogationForKey(e, minOpen)
          if (e.key === 'Escape') {
            setMinOpen(false)
          }
        }}
        onKeyDown={(e) => {
          checkPropogationForKey(e, minOpen)
          if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            setMinOpen(true)
          }
        }}
        onMenuItemSelected={(priceMin) => {
          setMinOpen(false)
          onMenuItemSelected?.({ priceMin })
        }}
        onChange={(priceMin) => onChange?.({ priceMin })}
      />

      <InputRangeSeparator />

      <Price
        label='Max Price'
        placeholder='Max'
        price={priceRange.priceMax}
        menuOpen={maxOpen}
        onFocus={handleMaxFocus}
        onBlur={onBlur}
        onClickAway={() => setMaxOpen(false)}
        onKeyUp={(e) => {
          checkPropogationForKey(e, maxOpen)
          if (e.key === 'Escape') {
            setMaxOpen(false)
          }
        }}
        onKeyDown={(e) => {
          checkPropogationForKey(e, maxOpen)
          if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            setMaxOpen(true)
          }
        }}
        onMenuItemSelected={(priceMax) => {
          setMaxOpen(false)
          onMenuItemSelected?.({ priceMax })
        }}
        onChange={(priceMax) => onChange?.({ priceMax })}
      />
    </fieldset>
  )
}

export default PriceRange
