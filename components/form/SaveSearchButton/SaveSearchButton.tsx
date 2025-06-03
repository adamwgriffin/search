import { useSession } from "next-auth/react";
import { useAppDispatch } from "../../../hooks/app_hooks";
import OutlinedButton from "../../design_system/OutlinedButton/OutlinedButton";
import { openModal } from "../../../store/application/applicationSlice";

const SaveSearchButton: React.FC = () => {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();

  return (
    <OutlinedButton
      textColor="var(--primary)"
      onClick={() =>
        dispatch(
          openModal({
            modalType: session?.user ? "saveSearch" : "loginOrRegister"
          })
        )
      }
    >
      Save Search
    </OutlinedButton>
  );
};

export default SaveSearchButton;
