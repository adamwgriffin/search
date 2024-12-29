import { type KeyboardEvent, useId, useState, useRef } from 'react'
import { NumericFormat } from 'react-number-format'
import { formatAbbreviatedPrice } from '../../../lib/listing_helpers'
import { elementIsVisible } from '../../../lib'
import MenuContainter from '../../design_system/MenuContainter/MenuContainter'
import MenuDropdown from '../../design_system/MenuDropdown/MenuDropdown'
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
  onKeyUp?: (event: KeyboardEvent<HTMLInputElement>) => void
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void
  onChange?: (price: number | null) => void
  onMenuItemSelected?: (price: number) => void
}

export const PriceRangeNumbers = [
  0, 50_000, 100_000, 150_000, 200_000, 250_000, 300_000, 350_000, 400_000,
  450_000, 500_000, 550_000, 600_000, 650_000, 700_000, 750_000, 800_000,
  850_000, 900_000, 950_000, 1_000_000, 1_250_000, 1_500_000, 1_750_000,
  2_000_000, 2_250_000, 2_500_000, 2_750_000, 3_000_000, 3_250_000, 3_500_000,
  3_750_000, 4_000_000, 4_250_000, 4_500_000, 4_750_000, 5_000_000, 6_000_000,
  7_000_000, 8_000_000, 9_000_000, 10_000_000, 11_000_000, 12_000_000,
  13_000_000, 14_000_000, 15_000_000, 16_000_000, 17_000_000, 18_000_000
]

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
  onKeyUp,
  onKeyDown,
  onChange,
  onMenuItemSelected
}) => {
  const uniqueID = useId()
  const listItemRefs = useRef<(HTMLLIElement | null)[]>([])
  const priceMenu = useRef<HTMLUListElement | null>(null)
  const [selectedListItemIndex, setSelectedListItemIndex] = useState(-1)

  const scrollListItemIfNotVisible = (listItemIndex: number) => {
    const selectedListItemElement = listItemRefs.current[listItemIndex]
    if (!selectedListItemElement || !priceMenu.current) return
    if (!elementIsVisible(selectedListItemElement, priceMenu.current)) {
      selectedListItemElement.scrollIntoView({ block: 'nearest' })
    }
  }

  const moveSelectionUp = () => {
    if (selectedListItemIndex === 0) return
    const newIndex = selectedListItemIndex - 1
    setSelectedListItemIndex(newIndex)
    scrollListItemIfNotVisible(newIndex)
  }

  const moveSelectionDown = () => {
    if (selectedListItemIndex === PriceRangeNumbers.length - 1) return
    const newIndex = selectedListItemIndex + 1
    setSelectedListItemIndex(newIndex)
    scrollListItemIfNotVisible(newIndex)
  }

  const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    onKeyUp?.(e)
    if (e.key === 'Enter' && selectedListItemIndex in PriceRangeNumbers) {
      onMenuItemSelected?.(PriceRangeNumbers[selectedListItemIndex])
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(e)
    switch (e.key) {
      case 'ArrowUp':
        moveSelectionUp()
        break
      case 'ArrowDown':
        moveSelectionDown()
        break
    }
  }

  const priceId = `price_${uniqueID}`
  const priceMenuId = `priceMenu_${uniqueID}`

  return (
    <MenuContainter onClickAway={onClickAway}>
      <label htmlFor={priceId} className={formStyles.accessibleLabel}>
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
        id={priceId}
        autoComplete='off'
        inputMode='numeric'
        role='combobox'
        aria-controls={priceMenuId}
        aria-expanded={menuOpen}
        aria-haspopup='listbox'
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyUp={handleKeyUp}
        onKeyDown={handleKeyDown}
      />
      <MenuDropdown open={menuOpen} fitWidth>
        <ul
          id={priceMenuId}
          ref={priceMenu}
          role='listbox'
          className={styles.priceList}
        >
          {PriceRangeNumbers.map((price, index) => (
            <li
              key={price}
              ref={(el) => {
                listItemRefs.current[index] = el
              }}
              className={styles.priceListItem}
              onClick={() => onMenuItemSelected?.(price)}
              role='option'
              aria-selected={selectedListItemIndex === index}
            >
              {price === 0 ? 'Any' : formatAbbreviatedPrice(price)}
            </li>
          ))}
        </ul>
      </MenuDropdown>
    </MenuContainter>
  )
}

export default Price
