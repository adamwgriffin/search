import { useId } from 'react'
import { NumericFormat } from 'react-number-format'
import MenuContainter from '../../design_system/MenuContainter/MenuContainter'
import MenuDropdown from '../../design_system/MenuDropdown/MenuDropdown'
import PriceRangeList from '../PriceRangeList/PriceRangeList'
import styles from './Price.module.css'
import formStyles from '../../../styles/forms.module.css'

export type PriceProps = {
  label: string
  placeholder?: string
  price: number | null
  menuOpen: boolean
  onFocus?: () => void
  onBlur?: () => void
  onClickAway?: () => void
  onChange?: (price: number | null) => void
  onMenuItemSelected?: (price: number) => void
}

// Passing null to NumericFormat.value does not clear the input but "" does for
// some reason
const normalizePrice = (price: number | null) => (price === null ? '' : price)

const Price: React.FC<PriceProps> = ({
  label,
  placeholder,
  price,
  menuOpen,
  onFocus,
  onBlur,
  onClickAway,
  onChange,
  onMenuItemSelected
}) => {
  const uniqueID = useId()
  const id = `price_${uniqueID}`

  return (
    <MenuContainter onClickAway={onClickAway}>
      <label htmlFor={id} className={formStyles.accessibleLabel}>
        {label}
      </label>
      <NumericFormat
        prefix={'$'}
        thousandSeparator=','
        allowNegative={false}
        decimalScale={0}
        value={normalizePrice(price)}
        // For falsey values we pass null to avoid the input being set to 0
        onValueChange={({ floatValue }) => onChange?.(floatValue || null)}
        placeholder={placeholder}
        className={formStyles.input}
        id={id}
        autoComplete='off'
        onFocus={onFocus}
        onBlur={onBlur}
        inputMode='numeric'
      />
      <MenuDropdown open={menuOpen} fitWidth>
        <div className={styles.priceListMenu}>
          <PriceRangeList onClick={onMenuItemSelected} />
        </div>
      </MenuDropdown>
    </MenuContainter>
  )
}

export default Price
