import {
  useState,
  useRef,
  useId,
  type FocusEvent,
  type ChangeEvent,
  type KeyboardEvent
} from 'react'
import { useClickAway } from 'react-use'
import SearchButton from '../SearchButton/SearchButton'
import LocationPinFilledIcon from '../../design_system/icons/LocationPinFilledIcon/LocationPinFilledIcon'
import PlacePredictionText from '../PlacePredictionText/PlacePredictionText'
import styles from './SearchField.module.css'

export type SearchFieldProps = {
  options: Array<google.maps.places.AutocompletePrediction>
  value?: string
  placeholder?: string
  onInput?: (details: string) => void
  onClearPlaceAutocompletePredictions?: () => void
  onSearchInitiated?: () => void
  onOptionSelected?: (option: google.maps.places.AutocompletePrediction) => void
  onGetPlaceAutocompletePredictions?: (val: string) => void
}

const UnselectedIndex = -1

const SearchField: React.FC<SearchFieldProps> = ({
  value,
  placeholder = 'Address, Neighborhood or Zip',
  options,
  onInput,
  onClearPlaceAutocompletePredictions,
  onSearchInitiated,
  onOptionSelected,
  onGetPlaceAutocompletePredictions
}) => {
  const id = useId()
  const ref = useRef(null)
  const [open, setOpen] = useState(false)
  const [inputHasFocus, setInputHasFocus] = useState(false)
  const [selectedListItemIndex, setSelectedListItemIndex] =
    useState(UnselectedIndex)
  const [lastInputValue, setLastInputValue] = useState<string | undefined>()

  const aListItemIsCurrentlySelected = () =>
    selectedListItemIndex > UnselectedIndex &&
    selectedListItemIndex < options.length

  const openDropdown = () => {
    if (!open) {
      setOpen(true)
      setLastInputValue(value)
    }
  }

  const closeDropdown = () => {
    if (open) {
      setOpen(false)
      setSelectedListItemIndex(UnselectedIndex)
    }
  }

  const setInputToNewListItemSelection = (newSelectedListItemIndex: number) => {
    onInput?.(options[newSelectedListItemIndex].description)
  }

  const setInputBackToLastValue = () => {
    onInput?.(lastInputValue || '')
  }

  const setInputAccordingToListItemSelection = (
    newSelectedListItemIndex: number
  ) => {
    newSelectedListItemIndex === UnselectedIndex
      ? setInputBackToLastValue()
      : setInputToNewListItemSelection(newSelectedListItemIndex)
  }

  // When the arrow keys go up or down the selection cycles through each menu
  // item in the options array. When the user reaches the beginning or end of
  // the list, the selection resets, and nothing is selected until they move up
  // or down again. This is how google's autocomplete widget behaves. The logic
  // for these functions increments or decrements activeDescendantKey for the
  // selections and uses UnselectedIndex (-1) to represent this intermediary
  // state where nothing is selected.
  //
  // The reason we use `newSelectedListItemIndex` rather than just setting
  // `selectedListItemIndex` and then using it is that
  // `setInputAccordingToListItemSelection()` runs before the component is
  // re-rendered, so it still has the old value of `selectedListItemIndex`
  const moveSelectionUp = () => {
    openDropdown()
    if (options.length === 0) return
    const newSelectedListItemIndex =
      selectedListItemIndex !== UnselectedIndex
        ? selectedListItemIndex - 1
        : options.length - 1
    setSelectedListItemIndex(newSelectedListItemIndex)
    setInputAccordingToListItemSelection(newSelectedListItemIndex)
  }

  const moveSelectionDown = () => {
    openDropdown()
    if (options.length === 0) return
    const newSelectedListItemIndex =
      selectedListItemIndex + 1 < options.length
        ? selectedListItemIndex + 1
        : UnselectedIndex
    setSelectedListItemIndex(newSelectedListItemIndex)
    setInputAccordingToListItemSelection(newSelectedListItemIndex)
  }

  const initiateSearch = () => {
    onClearPlaceAutocompletePredictions?.()
    onSearchInitiated?.()
    closeDropdown()
  }

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    setInputHasFocus(true)
    e.target.select()
    openDropdown()
  }

  const handleEscape = () => {
    closeDropdown()
    setInputBackToLastValue()
  }

  const handleBlur = () => {
    setInputHasFocus(false)
  }

  const handleListItemClick = (
    option: google.maps.places.AutocompletePrediction
  ) => {
    onOptionSelected?.(option)
    onClearPlaceAutocompletePredictions?.()
    closeDropdown()
  }

  const handleEnter = () => {
    if (aListItemIsCurrentlySelected()) {
      onOptionSelected?.(options[selectedListItemIndex])
      onClearPlaceAutocompletePredictions?.()
      closeDropdown()
    } else {
      initiateSearch()
    }
  }

  const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation()
    switch (e.key) {
      case 'Enter':
        handleEnter()
        break
      case 'Escape':
        handleEscape()
        break
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation()
    switch (e.key) {
      case 'Tab':
        closeDropdown()
        break
      case 'ArrowUp':
        moveSelectionUp()
        break
      case 'ArrowDown':
        moveSelectionDown()
        break
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    openDropdown()
    const val = e.target.value
    onInput?.(val)
    val
      ? onGetPlaceAutocompletePredictions?.(val)
      : onClearPlaceAutocompletePredictions?.()
    setLastInputValue(val)
  }

  const listItemId = (index: number) =>
    `search-listbox-${id}-list-item-${index}`

  const ariaActivedescendant = () => {
    return aListItemIsCurrentlySelected()
      ? listItemId(selectedListItemIndex)
      : ''
  }

  useClickAway(ref, closeDropdown)

  const listboxId = `search-listbox-${id}`

  return (
    <div className={styles.comboboxWrapper} ref={ref}>
      <div className={styles.searchFieldElements}>
        <input
          id='locationSearchField'
          name='locationSearchField'
          className={styles.locationSearchField}
          role='combobox'
          aria-controls={listboxId}
          aria-expanded={open}
          aria-label='Location Search'
          aria-autocomplete='list'
          aria-activedescendant={ariaActivedescendant()}
          type='text'
          autoComplete='off'
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyUp={handleKeyUp}
          onKeyDown={handleKeyDown}
          onClick={openDropdown}
        />
        <SearchButton onClick={initiateSearch} />
      </div>
      <ul
        id={listboxId}
        role='listbox'
        tabIndex={-1}
        className={open ? styles.listboxOpen : styles.listboxClosed}
      >
        {options.map((option, index) => (
          <li
            id={listItemId(index)}
            role='option'
            key={option.place_id}
            className={
              selectedListItemIndex === index
                ? styles.listItemSelected
                : styles.listItem
            }
            aria-selected={selectedListItemIndex === index}
            onClick={() => handleListItemClick(option)}
          >
            <LocationPinFilledIcon active={selectedListItemIndex === index} />
            <PlacePredictionText prediction={option} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SearchField
