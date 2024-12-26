import type { NextPage } from 'next'
import {
  useState,
  useEffect,
  useRef,
  useId,
  FocusEvent,
  ChangeEvent,
  KeyboardEvent
} from 'react'
import { useClickAway } from 'react-use'
import SearchButton from '../SearchButton/SearchButton'
import LocationPinFilledIcon from '../../design_system/icons/LocationPinFilledIcon/LocationPinFilledIcon'
import PlacePredictionText from '../PlacePredictionText/PlacePredictionText'
import styles from './SearchField.module.css'

export interface SearchFieldProps {
  value?: string
  placeholder?: string
  options: Array<google.maps.places.AutocompletePrediction>
  onInput?: (details: string) => void
  onClearPlaceAutocompletePredictions?: () => void
  onSearchInitiated?: () => void
  onOptionSelected?: (option: google.maps.places.AutocompletePrediction) => void
  onGetPlaceAutocompletePredictions?: (val: string) => void
}

const SearchField: NextPage<SearchFieldProps> = ({
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
  const [activeDescendantKey, setActiveDescendantKey] = useState(-1)
  const [lastInputValue, setLastInputValue] = useState<string | undefined>()

  const listItemSelected = () => {
    return activeDescendantKey > -1 && activeDescendantKey < options.length
  }

  // This is used for the aria-activedescendant attribute. It identifies the
  // currently selected item in the dropdown menu for accessibility purposes.
  const activeDescendant = () => {
    return listItemSelected()
      ? `search-listbox-${id}-list-item-${activeDescendantKey}`
      : ''
  }

  const deselectListItem = () => setActiveDescendantKey(-1)

  const setInputToListItemSelection = () => {
    onInput?.(options[activeDescendantKey].description)
  }

  const setInputBackToLastValue = () => {
    onInput?.(lastInputValue || '')
  }

  // If we select a list item with the keyboard, we want to set the input value
  // to that list item. If the selection moved past the items in the list menu,
  // which causes nothing to be selected, we want to set the input back to it's
  // last value before we had made any selections.
  const setInputAccordingToListItemSelection = () => {
    listItemSelected()
      ? setInputToListItemSelection()
      : setInputBackToLastValue()
  }

  const openDropdown = () => {
    if (!open) {
      setOpen(true)
      setLastInputValue(value)
    }
  }

  const closeDropdown = () => {
    if (open) {
      setOpen(false)
      deselectListItem()
    }
  }

  // The activeDescendantKey variable is allowed to be incremented to values
  // that are one step beyond the actual indexes of the options array. This
  // allows the user to move the selection down past the last item with the
  // arrow key, which causes nothing to be selected, but then move the selection
  // back up to select that last item again, or alternatively, to move down once
  // more to go back to the first item. This is how google's autocomplete widget
  // behaves.
  const moveDown = () => {
    openDropdown()
    if (activeDescendantKey < options.length) {
      setActiveDescendantKey(activeDescendantKey + 1)
      setInputAccordingToListItemSelection()
    } else {
      // If we are one past the last item in the menu, go back to the beginning,
      // and select the first item again
      setActiveDescendantKey(0)
    }
  }

  const moveUp = () => {
    openDropdown()
    if (activeDescendantKey > -1) {
      setActiveDescendantKey(activeDescendantKey - 1)
      setInputAccordingToListItemSelection()
    } else {
      // If we are one past the first item in the menu, go down to the end, and
      // select the last item again
      setActiveDescendantKey(options.length - 1)
    }
  }

  const initiateSearch = () => {
    onClearPlaceAutocompletePredictions?.()
    onSearchInitiated?.()
    closeDropdown()
  }

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    setInputHasFocus(true)
    e.target.select()
    if (options.length) openDropdown()
  }

  const handleEscape = () => {
    closeDropdown()
    setInputBackToLastValue()
  }

  const handleBlur = () => {
    setInputHasFocus(false)
  }

  const handleMenuItemClick = (
    option: google.maps.places.AutocompletePrediction
  ) => {
    onOptionSelected?.(option)
    onClearPlaceAutocompletePredictions?.()
    closeDropdown()
  }

  const handleEnter = () => {
    if (listItemSelected()) {
      onOptionSelected?.(options[activeDescendantKey])
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
        moveUp()
        break
      case 'ArrowDown':
        moveDown()
        break
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    onInput?.(val)
    val
      ? onGetPlaceAutocompletePredictions?.(val)
      : onClearPlaceAutocompletePredictions?.()
    setLastInputValue(val)
  }

  useClickAway(ref, closeDropdown)

  useEffect(() => {
    // We have updated autocomplete options, open the dropdown unless it's
    // currently open
    if (options.length && !open) {
      setOpen(true)
      setLastInputValue(value)
    }
    // Update has no autocomplete options, close the dropdown if it's currently open
    if (!options.length && open) {
      setOpen(false)
      deselectListItem()
    }
  }, [options, open, value])

  return (
    <div className={styles.comboboxWrapper} ref={ref}>
      <div className={styles.searchFieldElements}>
        <div
          className={
            inputHasFocus
              ? styles.comboboxInputHasFocus
              : styles.comboboxInputNoFocus
          }
          role='combobox'
          aria-controls='search-listbox'
          aria-haspopup='listbox'
          aria-expanded={open}
          aria-owns={`search-listbox-${id}`}
        >
          <input
            id='locationSearchField'
            name='locationSearchField'
            className={styles.locationSearchField}
            aria-label='Location Search'
            aria-autocomplete='list'
            aria-controls={`search-listbox-${id}`}
            aria-activedescendant={activeDescendant()}
            type='text'
            autoComplete='off'
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyUp={handleKeyUp}
            onKeyDown={handleKeyDown}
          />
        </div>
        <SearchButton onClick={initiateSearch} />
      </div>
      <ul
        id='search-listbox'
        className={open ? styles.listboxMenu : styles.listboxMenuClosed}
        role='listbox'
        tabIndex={-1}
      >
        {options.map((option, index) => (
          <li
            role='option'
            id={`search-listbox-${id}-list-item-${index}`}
            key={option.place_id}
            className={
              activeDescendantKey === index
                ? styles.listItemActive
                : styles.listItem
            }
            aria-selected={activeDescendantKey === index}
            onClick={() => handleMenuItemClick(option)}
          >
            <LocationPinFilledIcon active={activeDescendantKey === index} />
            <PlacePredictionText prediction={option} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SearchField
