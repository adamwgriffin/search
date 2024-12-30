import { type PayloadAction, createSlice } from '@reduxjs/toolkit'
import {
  searchWithUpdatedFilters,
  newLocationGeocodeSearch,
  standaloneSearchInitialized
} from '../listingSearch/listingSearchCommon'
import { autocompletePredictionSelected } from '../autocomplete/autocompleteSlice'
import { FiltersState, SearchTypeOption } from './filtersTypes'
import { DefaultSoldInLast } from '../../config'
import { SearchTypes } from '../../lib/filter'

export const initialState: FiltersState = {
  searchType: SearchTypes.Buy,
  locationSearchField: 'Fremont, Seattle, WA, USA',
  propertyTypes: [],
  includePending: false,
  openHouse: false,
  pageIndex: 0,
  pageSize: 20,
  priceMin: null,
  priceMax: null,
  bedsMin: 0,
  bathsMin: 0,
  sqftMin: null,
  sqftMax: null,
  sortBy: 'listedDate',
  sortDirection: 'desc',
  lotSizeMin: null,
  yearBuiltMin: null,
  yearBuiltMax: null,
  waterfront: false,
  view: false,
  fireplace: false,
  basement: false,
  garage: false,
  newConstruction: false,
  pool: false,
  airConditioning: false,
  soldInLast: null
}

export const filtersSlice = createSlice({
  name: 'filters',

  initialState,

  reducers: {
    setFilters: (state, action: PayloadAction<Partial<FiltersState>>) => {
      // TODO: Why are we replacing the entire state?
      // we have to return the object in order to replace the entire state
      return { ...state, ...action.payload }
    },

    setSearchType: (state, action: PayloadAction<SearchTypeOption>) => {
      state.searchType = action.payload
      switch (action.payload) {
        case SearchTypes.Sold:
          state.openHouse = false
          state.soldInLast = DefaultSoldInLast
          break
        case SearchTypes.Rent:
          state.openHouse = false
          state.soldInLast = null
          break
        case SearchTypes.Buy:
          state.soldInLast = null
          break
      }
    },

    resetStartIndex: (state) => {
      state.pageIndex = initialState.pageIndex
    },

    clearFilters: () => initialState
  },

  extraReducers: (builder) => {
    builder.addCase(standaloneSearchInitialized, () => initialState)

    builder.addCase(autocompletePredictionSelected, (state, action) => {
      state.locationSearchField = action.payload.description
    })

    builder.addCase(newLocationGeocodeSearch.pending, (state) => {
      state.pageIndex = initialState.pageIndex
    })

    builder.addCase(searchWithUpdatedFilters.pending, (state) => {
      state.pageIndex = initialState.pageIndex
    })
  }
})

export const { setFilters, setSearchType, resetStartIndex, clearFilters } =
  filtersSlice.actions

export default filtersSlice.reducer
