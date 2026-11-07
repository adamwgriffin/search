"use client";

import { useSession } from "next-auth/react";
import SaveSearchButton from "@/components/form/SaveSearchButton/SaveSearchButton";
import { openModal } from "@/store/applicationStore";

const SaveSearchButtonContainer: React.FC = () => {
  const { data: session } = useSession();

  return (
    <SaveSearchButton
      onClick={() =>
        openModal({
          modalType: session?.user ? "saveSearch" : "loginOrRegister"
        })
      }
    />
  );
};

export default SaveSearchButtonContainer;
