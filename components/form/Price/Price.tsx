import { type KeyboardEvent, useId, useState, useRef } from 'react'
import { NumericFormat } from 'react-number-format'
import { formatAbbreviatedPrice } from '../../../lib/listing_helpers'
import { elementIsVisible } from '../../../lib'
import MenuContainter from '../../design_system/MenuContainter/MenuContainter'
import MenuDropdown from '../../design_system/MenuDropdown/MenuDropdown'
import MenuOpenIcon from '../../design_system/icons/MenuOpenIcon/MenuOpenIcon'
import styles from './Price.module.css'
import formStyles from '../../../styles/forms.module.css'

export type PriceProps = {
  label: string
  price: number | null
  options: number[]
  placeholder?: string
  menuOpen: boolean
  onFocus?: () => void
  onBlur?: () => void
  onClickAway?: () => void
  onKeyUp?: (event: KeyboardEvent<HTMLInputElement>) => void
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void
  onChange?: (price: number | null) => void
  onMenuItemSelected?: (price: number) => void
  onMenuButtonClick?: () => void
}

// Passing null to NumericFormat.value does not clear the input but "" does for
// some reason
const normalizePrice = (price: number | null) => (price === null ? '' : price)

const Price: React.FC<PriceProps> = ({
  label,
  price,
  options,
  placeholder,
  menuOpen,
  onFocus,
  onBlur,
  onClickAway,
  onKeyUp,
  onKeyDown,
  onChange,
  onMenuItemSelected,
  onMenuButtonClick
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
    if (selectedListItemIndex === options.length - 1) return
    const newIndex = selectedListItemIndex + 1
    setSelectedListItemIndex(newIndex)
    scrollListItemIfNotVisible(newIndex)
  }

  const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    onKeyUp?.(e)
    if (e.key === 'Enter' && selectedListItemIndex in options) {
      onMenuItemSelected?.(options[selectedListItemIndex])
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

  const priceId = `price__${uniqueID}`
  const priceMenuId = `priceMenu__${uniqueID}`

  return (
    <MenuContainter onClickAway={onClickAway}>
      <label htmlFor={priceId} className={formStyles.accessibleLabel}>
        {label}
      </label>
      <div className={styles.priceField}>
        <NumericFormat
          prefix={'$'}
          thousandSeparator=','
          allowNegative={false}
          decimalScale={0}
          value={normalizePrice(price)}
          // For falsey values we pass null to avoid the input being set to 0
          onValueChange={({ floatValue }) => onChange?.(floatValue || null)}
          placeholder={placeholder}
          id={priceId}
          className={styles.priceInput}
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
        <div
          role='button'
          className={styles.menuButton}
          onClick={onMenuButtonClick}
        >
          <MenuOpenIcon open={menuOpen} />
        </div>
      </div>
      <MenuDropdown open={menuOpen} fitWidth>
        <ul
          id={priceMenuId}
          ref={priceMenu}
          role='listbox'
          className={styles.priceList}
        >
          {options.map((price, index) => (
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
