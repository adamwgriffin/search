"use client";

import { useCallback } from "react";
import { useSearchParamsState } from "~/providers/SearchParamsProvider";
import ContainedButton from "../../../components/design_system/ContainedButton/ContainedButton";
import Footer from "../../../components/design_system/Footer/Footer";
import Modal from "../../../components/design_system/modal/Modal/Modal";
import ModalBody from "../../../components/design_system/modal/ModalBody/ModalBody";
import ModalHeader from "../../../components/design_system/modal/ModalHeader/ModalHeader";
import TextButton from "../../../components/design_system/TextButton/TextButton";
import { useAppDispatch, useAppSelector } from "../../../hooks/app_hooks";
import {
  closeModal,
  selectFiltersModalOpen
} from "../../../store/application/applicationSlice";
import { selectTotalListings } from "../../../store/listingSearch/listingSearchSelectors";
import More from "../../More/More";

const showListingsMessage = (n: number) =>
  `Show ${n.toLocaleString()} ${n === 1 ? "Home" : "Homes"}`;

const FiltersModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const modalOpen = useAppSelector(selectFiltersModalOpen);
  const totalListings = useAppSelector(selectTotalListings);
  const { clearSearchParamsFilters } = useSearchParamsState();

  const handleClose = useCallback(() => dispatch(closeModal()), [dispatch]);

  return (
    <Modal
      isOpen={modalOpen}
      contentLabel="Filters"
      fullScreenOnMobile={true}
      onRequestClose={handleClose}
    >
      <ModalHeader title={"Filters"} onClose={handleClose} />
      <ModalBody>
        <More />
      </ModalBody>
      <Footer>
        <TextButton onClick={clearSearchParamsFilters}>Clear All</TextButton>
        <ContainedButton onClick={handleClose}>
          {showListingsMessage(totalListings)}
        </ContainedButton>
      </Footer>
    </Modal>
  );
};

export default FiltersModal;
