import type { ListingDetail } from "../../types/listing_types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const listingDetailApi = createApi({
  reducerPath: "listingDetailApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    getListingDetail: builder.query<ListingDetail, string>({
      query: (listingSlug) => `listing_detail/${listingSlug}`
    })
  })
});

export const { useGetListingDetailQuery } = listingDetailApi;
