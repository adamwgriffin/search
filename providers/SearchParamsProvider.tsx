"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode
} from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  getUpdatedQueryString,
  objectToQueryString
} from "~/lib/listingSearchParams";
import {
  type SearchParams,
  type SearchParamsUpdate,
  searchParamsSchema
} from "~/zod_schemas/searchParamsSchema";

type SearchParamsContextValue = {
  searchParamsState: Readonly<SearchParams>;
  updateSearchParams: (newParams: SearchParamsUpdate) => void;
  clearSearchParamsFilters: () => void;
};

const SearchParamsContext = createContext<SearchParamsContextValue | undefined>(
  undefined
);

export const SearchParamsProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [searchParamsState, setSearchParamsState] = useState<
    Readonly<SearchParams>
  >({});

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    // TODO: Handle schema errors after parsing. Remove any error keys and try
    // parsing again. Would also need to do this in the react query hooks
    const parsed = searchParamsSchema.parse(params);
    setSearchParamsState(Object.freeze(parsed));
  }, [searchParams]);

  const updateSearchParams = (newParams: SearchParamsUpdate) => {
    const updatedQueryString = getUpdatedQueryString(
      searchParamsState,
      newParams
    );
    const url =
      updatedQueryString === ""
        ? pathname
        : `${pathname}?${updatedQueryString}`;
    router.push(url);
  };

  const clearSearchParamsFilters = () => {
    const address = searchParams.get("address");
    const url = address
      ? `${pathname}?${objectToQueryString({ address })}`
      : pathname;
    router.push(url);
  };

  return (
    <SearchParamsContext.Provider
      value={{
        searchParamsState,
        updateSearchParams,
        clearSearchParamsFilters
      }}
    >
      {children}
    </SearchParamsContext.Provider>
  );
};

export const useSearchParamsState = (): SearchParamsContextValue => {
  const context = useContext(SearchParamsContext);
  if (context === undefined) {
    throw new Error("useSearchState must be used within a SearchStateProvider");
  }
  return context;
};
