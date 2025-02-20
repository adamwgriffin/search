import type { ChangeEvent } from 'react'
import type { MoreFilters } from '../../store/filters/filtersTypes'
import type {
  SquareFeetRangeFilters,
  YearBuiltRangeFilters
} from '../../store/filters/filtersTypes'
import type { SearchTypeOption } from '../../store/filters/filtersTypes'
import type { AppState } from '../../store'
import styles from './More.module.css'
import { useAppSelector, useAppDispatch } from '../../hooks/app_hooks'
import { useRunCallbackIfChanged } from '../../hooks/run_callback_if_changed_hook'
import { searchWithUpdatedFilters } from '../../store/listingSearch/listingSearchCommon'
import { setFilters, setSearchType } from '../../store/filters/filtersSlice'
import {
  selectSearchType,
  selectOpenHouse, selectIncludePending,
  selectSquareFeetRange,
  selectYearBuiltRange,
  selectFeatures,
  selectSoldInLast
} from '../../store/filters/filtersSelectors'
import SearchTypeSelector from '../../components/form/SearchTypeSelector/SearchTypeSelector'
import PriceContainer from '../PriceContainer/PriceContainer'
import BedsAndBaths from '~/components/form/BedsAndBaths/BedsAndBaths'
import IncludePending from '../../components/form/IncludePending/IncludePending'
import PropertyType from '../../components/form/PropertyTypes/PropertyTypes'
import SquareFeet from '../../components/form/SquareFeet/SquareFeet'
import LotSize from '../../components/form/LotSize/LotSize'
import YearBuilt from '../../components/form/YearBuilt/YearBuilt'
import OpenHouse from '../../components/form/OpenHouse/OpenHouse'
import Features from '../../components/form/Features/Features'
import SoldDays from '../../components/form/SoldDays/SoldDays'
import { SearchTypes } from '../../lib/filter'

const More: React.FC = () => {
  const dispatch = useAppDispatch()
  const searchType = useAppSelector(selectSearchType)
  const openHouse = useAppSelector(selectOpenHouse)
  const includePending = useAppSelector(selectIncludePending)
  const squareFeetRange = useAppSelector(selectSquareFeetRange)
  const lotSizeMin = useAppSelector(
    (state: AppState) => state.filters.lotSizeMin
  )
  const yearBuiltRange = useAppSelector(selectYearBuiltRange)
  const features = useAppSelector(selectFeatures)
  const soldInLast = useAppSelector(selectSoldInLast)

  const [setPreviousYearBuilt, runSearchIfYearBuiltChanged] =
    useRunCallbackIfChanged<YearBuiltRangeFilters>(yearBuiltRange, () =>
      dispatch(searchWithUpdatedFilters())
    )
  const [setPreviousSquareFeetRange, runSearchIfSquareFeetChanged] =
    useRunCallbackIfChanged<SquareFeetRangeFilters>(squareFeetRange, () =>
      dispatch(searchWithUpdatedFilters())
    )

  const handleSearchTypeChange = (searchType: SearchTypeOption) => {
    dispatch(setSearchType(searchType))
    dispatch(searchWithUpdatedFilters())
  }

  const handleIncludePendingChange = (includePending: boolean) => {
    dispatch(setFilters({ includePending }))
    dispatch(searchWithUpdatedFilters())
  }

  const handleOpenHouseChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setFilters({ openHouse: e.target.checked }))
    dispatch(searchWithUpdatedFilters())
  }

  const handleChange = (params: Partial<MoreFilters>) => {
    dispatch(setFilters(params))
  }

  const handleChangeAndInitiateSearch = (params: Partial<MoreFilters>) => {
    dispatch(setFilters(params))
    dispatch(searchWithUpdatedFilters())
  }

  return (
    <div className={styles.more}>
      <SearchTypeSelector
        searchType={searchType}
        onChange={handleSearchTypeChange}
      />
      <div className={styles.mobileFilters}>
        <PriceContainer />
        <BedsAndBaths />
      </div>
      {searchType === SearchTypes.Buy && (
        <div className={styles.buyFilters}>
          <OpenHouse checked={openHouse} onChange={handleOpenHouseChange} />
          <IncludePending
            includePending={includePending}
            onChange={handleIncludePendingChange}
          />
        </div>
      )}
      {searchType !== SearchTypes.Rent && <PropertyType />}
      {searchType === SearchTypes.Sold && (
        <SoldDays
          soldInLast={soldInLast}
          onChange={handleChangeAndInitiateSearch}
        />
      )}
      <SquareFeet
        squareFeetRange={squareFeetRange}
        onChange={handleChange}
        onFocus={setPreviousSquareFeetRange}
        onBlur={runSearchIfSquareFeetChanged}
      />
      <LotSize
        lotSizeMin={lotSizeMin}
        onChange={handleChangeAndInitiateSearch}
      />
      <YearBuilt
        yearBuiltRange={yearBuiltRange}
        onChange={handleChange}
        onFocus={setPreviousYearBuilt}
        onBlur={runSearchIfYearBuiltChanged}
      />
      <Features
        featureFilters={features}
        onChange={handleChangeAndInitiateSearch}
      />
    </div>
  )
}

export default More
