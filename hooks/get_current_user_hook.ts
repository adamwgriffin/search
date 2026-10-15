import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { CurrentUser } from "@/app/api/current_user/route";

async function fetchCurrentUser() {
  const res = await fetch("/api/current_user");
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json() as Promise<CurrentUser>;
}

/** The query key used for the currentUser query. It's used by other queries for
 * optimitic updates. */
export const currentUserQueryKey = (userId?: string) =>
  ["currentUser", userId] as const;

/** Fetch the currently logged-in user data */
export const useGetCurrentUser = () => {
  const { data: session, status } = useSession();

  return useQuery({
    queryKey: currentUserQueryKey(session?.user?.id),
    queryFn: fetchCurrentUser,
    enabled: status === "authenticated"
  });
};
