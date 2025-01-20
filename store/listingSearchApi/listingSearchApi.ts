import type { ListingSearchGeocodeResponse } from '../../types/listing_types'
import type { ListingServiceParams } from '../../types/listing_service_params_types'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const listingSearchApi = createApi({
  reducerPath: 'listingSearchApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/listing/search' }),
  endpoints: (builder) => ({
    getNewLocation: builder.query<ListingSearchGeocodeResponse, ListingServiceParams>({
      query: (params) => ({
        url: '/geocode',
        params
      })
    })
  })
})

export const { useGetNewLocationQuery, useLazyGetNewLocationQuery } = listingSearchApi
