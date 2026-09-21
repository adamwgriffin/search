import { useSession } from "next-auth/react";
import { useAppDispatch } from "../../../hooks/app_hooks";
import OutlinedButton from "../../design_system/OutlinedButton/OutlinedButton";
import { openModal } from "../../../store/application/applicationSlice";
import styles from "./SaveSearchButton.module.css";

const SaveSearchButton: React.FC = () => {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();

  return (
    <OutlinedButton
      className={styles.className}
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
