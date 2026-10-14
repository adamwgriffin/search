"use client";

import toast from "react-hot-toast";
import { MdDelete } from "react-icons/md";
import { getSearchDescription } from "../../lib/saved_search_helpers";
import formStyles from "../../styles/forms.module.css";
import styles from "./SavedSearchCard.module.css";
import { useSearchState } from "@/hooks/useSearchState";
import type { SavedSearch } from "@prisma/client";
import { type SearchState } from "@/zod_schemas/searchStateSchema";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export type SavedSearchCard = {
  savedSearch: SavedSearch;
};

const SavedSearchCard: React.FC<SavedSearchCard> = ({ savedSearch }) => {
  const router = useRouter();
  const { setSearchState } = useSearchState();

  const { mutate: deleteSavedSearch, isPending: deleteSavedSearchPending } =
    useMutation({
      mutationFn: async () => {
        const res = await fetch(`/api/saved_search/${savedSearch.id}`, {
          method: "DELETE"
        });
        if (!res.ok) throw new Error("Failed to delete");
      },
      onSuccess: () => {
        toast("Saved search deleted");
        // We need this to refresh the list of cards since it's generated on the
        // server.
        router.refresh();
      },
      onError: () => {
        toast("Couldn't delete saved search. Please try again.");
      }
    });

  const { mutate: updateSavedSearch, isPending: updateSavedSearchPending } =
    useMutation({
      mutationFn: async (messageCadence: number) => {
        const res = await fetch(`/api/saved_search/${savedSearch.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messageCadence })
        });
        if (!res.ok) throw new Error("Failed to update");
      },
      onSuccess: () => {
        toast("Saved search updated");
        router.refresh();
      },
      onError: () => toast("Couldn't update saved search. Please try again.")
    });

  const messageCadenceId = `messageCadence_${savedSearch.id}`;
  // TODO: Could parse with Zod instead of casting the type
  const searchState = savedSearch.searchState as SearchState;

  return (
    <div
      className={styles.savedSearch}
      onClick={() => setSearchState(searchState)}
    >
      <div className={styles.body}>
        <h2 className={styles.heading}>{savedSearch.name}</h2>
        <p>{getSearchDescription(searchState)}</p>
        <label htmlFor={messageCadenceId} className={formStyles.label}>
          Email Me
        </label>
        <select
          id={messageCadenceId}
          className={formStyles.select}
          onChange={(e) => updateSavedSearch(Number(e.target.value))}
          onClick={(e) => e.stopPropagation()}
          value={savedSearch.messageCadence}
        >
          <option value={1}>Daily</option>
          <option value={7}>Weekly</option>
          <option value={0}>Never</option>
        </select>
      </div>
      <div className={styles.footer}>
        <button
          className={styles.deleteButton}
          disabled={deleteSavedSearchPending}
          onClick={(e) => {
            e.stopPropagation();
            deleteSavedSearch();
          }}
          title="Delete Saved Search"
        >
          <MdDelete className={styles.deleteButtonIcon} />
        </button>
      </div>
    </div>
  );
};

export default SavedSearchCard;
