import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { type CurrentUser } from "@/app/api/current_user/route";
import type { Listing } from "@/types/listing_types";
import { currentUserQueryKey } from "./get_current_user_hook";

type ToggleFavoriteArgs = {
  listingId: Listing["_id"];
  isFavorite: boolean;
};

const addFavorite = (
  favoriteIds: CurrentUser["favoriteIds"],
  listingId: Listing["_id"]
) => [...favoriteIds, listingId];

const removeFavorite = (
  favoriteIds: CurrentUser["favoriteIds"],
  listingId: Listing["_id"]
) => favoriteIds.filter((id) => id !== listingId);

/** Toggle a favorite listing for a user with optimistic updates. */
export function useToggleFavorite() {
  const { data: session } = useSession();
  const queryKey = currentUserQueryKey(session?.user?.id);

  return useMutation({
    mutationFn: async ({ listingId, isFavorite }: ToggleFavoriteArgs) => {
      const res = await fetch(`/api/favorites/${listingId}`, {
        method: isFavorite ? "DELETE" : "POST"
      });
      if (!res.ok) throw new Error("Failed to update favorite");
    },

    // This part does an optimistic update of currentUser.favoriteIds before the
    // request is sent to the server in mutationFn.
    onMutate: async ({ listingId, isFavorite }, context) => {
      // Cancel in-flight refetches so they can't overwrite our optimistic update
      await context.client.cancelQueries({ queryKey });

      // Snapshot the current user so we can restore it if the request fails
      const previousUser = context.client.getQueryData<CurrentUser>(queryKey);

      // Optimistically update to the new value by writing it directly to the
      // cache
      context.client.setQueryData<CurrentUser>(queryKey, (currentUser) => {
        // Nothing cached yet, so there is nothing to update
        if (!currentUser) return currentUser;

        const updatedFavoriteIds = isFavorite
          ? removeFavorite(currentUser.favoriteIds, listingId)
          : addFavorite(currentUser.favoriteIds, listingId);

        return { ...currentUser, favoriteIds: updatedFavoriteIds };
      });

      // Return a result with the snapshotted value to be passed to onError as
      // `onMutateResult`
      return { previousUser };
    },

    onError: (_error, _variables, onMutateResult, context) => {
      // Roll back to the snapshot taken in onMutate
      context.client.setQueryData(queryKey, onMutateResult?.previousUser);
    },

    // Success or failure, re-sync with the server
    onSettled: (_data, _error, _variables, _onMutateResult, context) => {
      context.client.invalidateQueries({ queryKey });
    }
  });
}
