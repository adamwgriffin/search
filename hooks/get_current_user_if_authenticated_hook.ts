import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAppSelector, useAppDispatch } from "./app_hooks";
import { getCurrentUser, selectCurrentUser } from "../store/user/userSlice";

export const useGetCurrentUserIfAuthenticated = () => {
  const { status } = useSession();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);

  useEffect(() => {
    if (status === "authenticated" && !currentUser) {
      dispatch(getCurrentUser());
    }
  }, [currentUser, dispatch, status]);

  return currentUser;
};
