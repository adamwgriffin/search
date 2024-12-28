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

const NoSelection = -1

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
  const [activeDescendantKey, setActiveDescendantKey] = useState(NoSelection)
  const [lastInputValue, setLastInputValue] = useState<string | undefined>()

  const aListItemIsCurrentlySelected = () =>
    activeDescendantKey > NoSelection && activeDescendantKey < options.length

  // This is used for the aria-activedescendant attribute. It identifies the
  // currently selected item in the dropdown menu for accessibility purposes.
  const activeDescendant = () => {
    return aListItemIsCurrentlySelected()
      ? `search-listbox-${id}-list-item-${activeDescendantKey}`
      : ''
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
      setActiveDescendantKey(NoSelection)
    }
  }

  const setInputToNewListItemSelection = (newActiveDescendantKey: number) => {
    onInput?.(options[newActiveDescendantKey].description)
  }

  const setInputBackToLastValue = () => {
    onInput?.(lastInputValue || '')
  }

  const setInputAccordingToListItemSelection = (
    newActiveDescendantKey: number
  ) => {
    newActiveDescendantKey === NoSelection
      ? setInputBackToLastValue()
      : setInputToNewListItemSelection(newActiveDescendantKey)
  }

  // When the arrow keys go up or down the selection cycles through each menu
  // item in the options array. When the user reaches the end of the top or
  // bottom of the list, the selection resets, and nothing is selected until
  // they go up or down again. This is how google's autocomplete widget behaves.
  // The logic for these functions increments or decrements activeDescendantKey
  // for the selections and uses NoSelection (-1) to represent this intermediary
  // state when nothing is selected.
  //
  // The reason we use `newActiveDescendantKey` rather than just setting
  // `activeDescendantKey` and then using it is that
  // `setInputAccordingToListItemSelection()` runs before the component is
  // re-rendered so it still has the old value of `activeDescendantKey`
  const moveUp = () => {
    openDropdown()
    if (options.length === 0) return
    const newActiveDescendantKey =
      activeDescendantKey !== NoSelection
        ? activeDescendantKey - 1
        : options.length - 1
    setActiveDescendantKey(newActiveDescendantKey)
    setInputAccordingToListItemSelection(newActiveDescendantKey)
  }

  const moveDown = () => {
    openDropdown()
    if (options.length === 0) return
    const newActiveDescendantKey =
      activeDescendantKey + 1 < options.length
        ? activeDescendantKey + 1
        : NoSelection
    setActiveDescendantKey(newActiveDescendantKey)
    setInputAccordingToListItemSelection(newActiveDescendantKey)
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

  const handleMenuItemClick = (
    option: google.maps.places.AutocompletePrediction
  ) => {
    onOptionSelected?.(option)
    onClearPlaceAutocompletePredictions?.()
    closeDropdown()
  }

  const handleEnter = () => {
    if (aListItemIsCurrentlySelected()) {
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
    openDropdown()
    const val = e.target.value
    onInput?.(val)
    val
      ? onGetPlaceAutocompletePredictions?.(val)
      : onClearPlaceAutocompletePredictions?.()
    setLastInputValue(val)
  }

  useClickAway(ref, closeDropdown)

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
            onClick={openDropdown}
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
