"use client";

import { useSearchState } from "@/providers/SearchStateProvider";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import ContainedButton from "../../../components/design_system/ContainedButton/ContainedButton";
import ModalFooter from "../../../components/design_system/Footer/Footer";
import Modal from "../../../components/design_system/modal/Modal/Modal";
import ModalBody from "../../../components/design_system/modal/ModalBody/ModalBody";
import ModalHeader from "../../../components/design_system/modal/ModalHeader/ModalHeader";
import TextButton from "../../../components/design_system/TextButton/TextButton";
import { useAppDispatch, useAppSelector } from "../../../hooks/app_hooks";
import {
  closeModal,
  selectSaveSearchModalOpen
} from "../../../store/application/applicationSlice";
import type { SavedSearchData } from "../../../store/user/userSlice";
import {
  createSavedSearch,
  selectCurrentUser
} from "../../../store/user/userSlice";
import formStyles from "../../../styles/forms.module.css";

export type SaveSearchFormData = Pick<
  SavedSearchData,
  "name" | "messageCadence"
>;

const SaveSearchModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const modalOpen = useAppSelector(selectSaveSearchModalOpen);
  const { searchState } = useSearchState();
  const currentUser = useAppSelector(selectCurrentUser);

  const { register, handleSubmit } = useForm<SaveSearchFormData>({
    defaultValues: {
      name: searchState.address ?? "Saved Search",
      messageCadence: 1
    }
  });

  const handleClose = useCallback(() => dispatch(closeModal()), [dispatch]);

  const handleSave = useCallback(
    async (formData: SaveSearchFormData) => {
      if (!currentUser?.id) {
        console.error("No user user id available");
        return;
      }
      await dispatch(
        createSavedSearch({
          userId: currentUser.id,
          name: formData.name,
          messageCadence: Number(formData.messageCadence),
          searchState
        })
      );
      handleClose();
      toast("Saved search created");
    },
    [currentUser?.id, dispatch, handleClose, searchState]
  );

  return (
    <Modal
      isOpen={modalOpen}
      contentLabel="Save Search"
      onRequestClose={handleClose}
    >
      <ModalHeader title="Save Search" onClose={handleClose} />
      <form onSubmit={handleSubmit(handleSave)}>
        <ModalBody>
          <div className={formStyles.inputGroup}>
            <label htmlFor="searchName" className={formStyles.label}>
              Name
            </label>
            <input
              id="searchName"
              type="text"
              className={formStyles.input}
              {...register("name")}
            />
          </div>
          <div className={formStyles.inputGroup}>
            <label htmlFor="messageCadence" className={formStyles.label}>
              Email Me
            </label>
            <select
              id="messageCadence"
              className={formStyles.select}
              {...register("messageCadence")}
            >
              <option value={1}>Daily</option>
              <option value={7}>Weekly</option>
              <option value={0}>Never</option>
            </select>
          </div>
        </ModalBody>
        <ModalFooter>
          <TextButton type="button" onClick={handleClose}>
            Cancel
          </TextButton>
          <ContainedButton type="submit">Save</ContainedButton>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default SaveSearchModal;
