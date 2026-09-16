import type { SavedSearchData } from "../../store/user/userSlice";
import { MdDelete } from "react-icons/md";
import { getSearchDescription } from "../../lib/saved_search_helpers";
import formStyles from "../../styles/forms.module.css";
import styles from "./SavedSearchCard.module.css";
import { useSearchState } from "@/hooks/useSearchState";

export type SavedSearchCard = {
  savedSearch: SavedSearchData;
  onUpdate?: (savedSearchUpdate: Partial<SavedSearchData>) => void;
  onDelete?: () => void;
};

const SavedSearchCard: React.FC<SavedSearchCard> = ({
  savedSearch,
  onUpdate,
  onDelete
}) => {
  const { setSearchState } = useSearchState();

  const messageCadenceId = `messageCadence_${savedSearch.id}`;

  return (
    <div
      className={styles.savedSearch}
      onClick={() => setSearchState(savedSearch.searchState)}
    >
      <div className={styles.body}>
        <h2 className={styles.heading}>{savedSearch.name}</h2>
        <p>{getSearchDescription(savedSearch.searchState)}</p>
        <label htmlFor={messageCadenceId} className={formStyles.label}>
          Email Me
        </label>
        <select
          id={messageCadenceId}
          className={formStyles.select}
          onChange={(e) =>
            onUpdate?.({ messageCadence: Number(e.target.value) })
          }
          onClick={(e) => e.stopPropagation()}
          value={savedSearch.messageCadence}
        >
          <option value={1}>Daily</option>
          <option value={7}>Weekly</option>
          <option value={0}>Never</option>
        </select>
      </div>
      <div className={styles.footer}>
        <button
          className={styles.deleteButton}
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
          }}
          title="Delete Saved Search"
        >
          <MdDelete className={styles.deleteButtonIcon} />
        </button>
      </div>
    </div>
  );
};

export default SavedSearchCard;
