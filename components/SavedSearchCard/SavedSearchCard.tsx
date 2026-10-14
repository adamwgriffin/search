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
import Fieldset from "@/components/design_system/Fieldset/Fieldset";
import { useOptimistic, useTransition } from "react";

export type SavedSearchCard = {
  savedSearch: SavedSearch;
};

const SavedSearchCard: React.FC<SavedSearchCard> = ({ savedSearch }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [optimisticCadence, setOptimisticCadence] = useOptimistic(
    savedSearch.messageCadence
  );
  const [isDeleted, setOptimisticDeleted] = useOptimistic(false);

  const { setSearchState } = useSearchState();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/saved_search/${savedSearch.id}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error("Failed to delete");
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (messageCadence: number) => {
      const res = await fetch(`/api/saved_search/${savedSearch.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageCadence })
      });
      if (!res.ok) throw new Error("Failed to update");
    }
  });

  function handleChangeMessageCadence(e: React.ChangeEvent<HTMLSelectElement>) {
    const messageCadence = Number(e.target.value);

    startTransition(async () => {
      setOptimisticCadence(messageCadence);
      try {
        await updateMutation.mutateAsync(messageCadence);
        toast("Saved search updated");
        // Code after an await is no longer inside the transition so we need to
        // start a new one for the refresh
        startTransition(() => router.refresh());
      } catch {
        toast("Couldn't update saved search. Please try again.");
      }
    });
  }

  function handleDelete() {
    startTransition(async () => {
      // Card disappears immediately
      setOptimisticDeleted(true);
      try {
        await deleteMutation.mutateAsync();
        toast("Saved search deleted");
        startTransition(() => router.refresh());
      } catch {
        // Transition ends, optimistic value reverts, card reappears
        toast("Couldn't delete saved search. Please try again.");
      }
    });
  }

  if (isDeleted) return null;

  const messageCadenceId = `messageCadence_${savedSearch.id}`;
  // TODO: Could parse with Zod instead of casting the type
  const searchState = savedSearch.searchState as SearchState;

  return (
    <form
      className={styles.savedSearch}
      onClick={() => setSearchState(searchState)}
    >
      <div className={styles.body}>
        <h2 className={styles.heading}>{savedSearch.name}</h2>
        <p className={styles.description}>
          {getSearchDescription(searchState)}
        </p>
        <Fieldset>
          <label htmlFor={messageCadenceId} className={formStyles.label}>
            Email Me
          </label>
          <select
            id={messageCadenceId}
            className={formStyles.select}
            onChange={handleChangeMessageCadence}
            onClick={(e) => e.stopPropagation()}
            disabled={isPending}
            value={optimisticCadence}
          >
            <option value={1}>Daily</option>
            <option value={7}>Weekly</option>
            <option value={0}>Never</option>
          </select>
        </Fieldset>
      </div>
      <div className={styles.footer}>
        <button
          className={styles.deleteButton}
          disabled={isPending}
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
          title="Delete Saved Search"
        >
          <MdDelete className={styles.deleteButtonIcon} />
        </button>
      </div>
    </form>
  );
};

export default SavedSearchCard;
