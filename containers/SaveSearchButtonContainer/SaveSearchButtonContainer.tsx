"use client";

import { useSession } from "next-auth/react";
import { useAppDispatch } from "@/hooks/app_hooks";
import SaveSearchButton from "@/components/form/SaveSearchButton/SaveSearchButton";
import { openModal } from "@/store/application/applicationSlice";

const SaveSearchButtonContainer: React.FC = () => {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();

  return (
    <SaveSearchButton
      onClick={() =>
        dispatch(
          openModal({
            modalType: session?.user ? "saveSearch" : "loginOrRegister"
          })
        )
      }
    />
  );
};

export default SaveSearchButtonContainer;
