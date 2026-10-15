import HeartIcon from "../../components/design_system/icons/HeartIcon/HeartIcon";
import { useAppDispatch } from "../../hooks/app_hooks";
import { useGetCurrentUser } from "../../hooks/get_current_user_hook";
import { openModal } from "../../store/application/applicationSlice";
import { useToggleFavorite } from "@/hooks/toggle_favorite_hook";
import styles from "./FavoriteButton.module.css";
import toast from "react-hot-toast";

export type FavoriteButtonProps = {
  listingId: string;
};

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ listingId }) => {
  const dispatch = useAppDispatch();
  const { data: currentUser } = useGetCurrentUser();
  const { mutate: toggleFavorite } = useToggleFavorite();
  const isFavorite = currentUser?.favoriteIds.includes(listingId) ?? false;

  const toggleFavoriteOrOpenModal = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentUser) {
      toggleFavorite(
        { listingId, isFavorite },
        {
          onError: () =>
            toast.error("Couldn't update favorite. Please try again.")
        }
      );
    } else {
      dispatch(openModal({ modalType: "loginOrRegister" }));
    }
  };

  return (
    <button
      type="button"
      className={styles.favoriteButton}
      aria-label="Favorite"
      aria-pressed={isFavorite}
      onClick={toggleFavoriteOrOpenModal}
    >
      <HeartIcon
        className={isFavorite ? styles.favoriteStroke : styles.favoriteFilled}
      />
    </button>
  );
};

export default FavoriteButton;
