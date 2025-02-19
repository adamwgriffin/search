import type {
  SortType,
  SortDirection
} from '../../../types/listing_service_params_types'
import { useState } from 'react'
import MenuButton from '../../design_system/MenuButton/MenuButton'
import CheckIcon from '../../design_system/icons/CheckIcon/CheckIcon'
import styles from './SortMenu.module.css'
import { useUpdateSearchParams } from '~/hooks/useUpdateSearchParams'
import { useSearchParams } from 'next/navigation'

export interface SortTypeLabels {
  label: string
  type: SortType
  direction: SortDirection
}

export const SortTypeLabels: SortTypeLabels[] = [
  {
    label: 'Newest',
    type: 'listedDate',
    direction: 'desc'
  },
  {
    label: 'Price (Lo-Hi)',
    type: 'listPrice',
    direction: 'asc'
  },
  {
    label: 'Price (Hi-Lo)',
    type: 'listPrice',
    direction: 'desc'
  },
  {
    label: 'Beds',
    type: 'beds',
    direction: 'desc'
  },
  {
    label: 'Baths',
    type: 'baths',
    direction: 'desc'
  },
  {
    label: 'Square Feet',
    type: 'sqft',
    direction: 'desc'
  }
]

const getCurrentSortLabel = (
  sortBy: string,
  sortDirection: string
) => {
  return SortTypeLabels.find(
    ({ type, direction }) => type === sortBy && direction === sortDirection
  )?.label
}

const SortMenu: React.FC = () => {
  const [open, setOpen] = useState(false)
  const searchParams = useSearchParams()
  const updateSearchParams = useUpdateSearchParams()

  const sort_by = searchParams.get('sort_by') || 'listedDate'
  const sort_direction =
    searchParams.get('sort_direction') || 'desc'
  const currentSortLabel = getCurrentSortLabel(sort_by, sort_direction)



  return (
    <MenuButton
      open={open}
      label={`Sort: ${currentSortLabel}`}
      condensed
      alignRight
      onClick={() => setOpen(!open)}
      onClickAway={() => setOpen(false)}
    >
      <ul className={styles.menu}>
        {SortTypeLabels.map(({ type, label, direction }) => (
          <li
            key={`${type}-${direction}`}
            onClick={() => {
              setOpen(false)
              updateSearchParams({ sort_by: type, sort_direction: direction })
            }}
            className={styles.menuItem}
          >
            <div>
              {sort_by === type && sort_direction== direction && (
                <CheckIcon />
              )}
            </div>
            <div>{label}</div>
          </li>
        ))}
      </ul>
    </MenuButton>
  )
}

export default SortMenu
