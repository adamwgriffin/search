import HeartIcon from "../../components/design_system/icons/HeartIcon/HeartIcon";
import { useAppDispatch } from "../../hooks/app_hooks";
import { useGetCurrentUserIfAuthenticated } from "../../hooks/get_current_user_if_authenticated_hook";
import { openModal } from "../../store/application/applicationSlice";
import { toggleFavorite } from "../../store/user/userSlice";
import styles from "./FavoriteButton.module.css";

export type FavoriteButtonProps = {
  listingId: string;
};

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ listingId }) => {
  const dispatch = useAppDispatch();
  const currentUser = useGetCurrentUserIfAuthenticated();
  const favoriteIds = currentUser?.favoriteIds || [];

  const toggleFavoriteOrOpenModal = () => {
    if (currentUser) {
      dispatch(toggleFavorite(listingId));
    } else {
      dispatch(openModal({ modalType: "loginOrRegister" }));
    }
  };

  return (
    <button
      className={styles.favoriteButton}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavoriteOrOpenModal();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          toggleFavoriteOrOpenModal();
        }
      }}
    >
      <HeartIcon
        id={
          favoriteIds.includes(listingId)
            ? styles.favoriteStroke
            : styles.favoriteFilled
        }
      />
    </button>
  );
};

export default FavoriteButton;
