"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";
import { useAppSelector, useAppDispatch } from "../../hooks/app_hooks";
import { selectGetSavedSearchesLoading } from "../../store/user/userSlice";
import { usePushParamsToSearchUrl } from "../../hooks/push_params_to_search_url_hook";
import { useGetCurrentUser } from "../../hooks/get_current_user_hook";
import {
  getSavedSearches,
  updateSavedSearch,
  deleteSavedSearch,
  selectSavedSearches
} from "../../store/user/userSlice";
import SavedSearchCard from "../../components/SavedSearchCard/SavedSearchCard";
import SavedSearchCardLoader from "../../components/SavedSearchCardLoader/SavedSearchCardLoader";
import styles from "./SavedSearchList.module.css";
import { useSearchState } from "@/providers/SearchStateProvider";

const SavedSearchList: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentUser = useGetCurrentUser();
  const pushParamsToSearchUrl = usePushParamsToSearchUrl();
  const getSavedSearchesLoading = useAppSelector(selectGetSavedSearchesLoading);
  const savedSearches = useAppSelector(selectSavedSearches);
  const { setSearchState } = useSearchState();

  useEffect(() => {
    if (currentUser?.id) {
      dispatch(getSavedSearches(currentUser?.id));
    }
  }, [dispatch, currentUser]);

  return (
    <ul className={styles.savedSearchCards}>
      {!getSavedSearchesLoading &&
        savedSearches.map((savedSearch) => (
          <li key={savedSearch.id}>
            <SavedSearchCard
              savedSearch={savedSearch}
              onClick={() => setSearchState(savedSearch.searchState)}
              onUpdate={(update) =>
                dispatch(updateSavedSearch({ id: savedSearch.id, ...update }))
              }
              onDelete={async () => {
                await dispatch(deleteSavedSearch(savedSearch.id));
                toast("Saved search deleted");
              }}
            />
          </li>
        ))}

      {(!currentUser?.id || getSavedSearchesLoading) &&
        [...Array(6)].map((_, i) => (
          <li key={i}>
            <SavedSearchCardLoader />
          </li>
        ))}
    </ul>
  );
};

export default SavedSearchList;
