"use client";

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/app_hooks";
import {
  selectFiltersModalOpen,
  closeModal
} from "../../../store/application/applicationSlice";
import { searchWithUpdatedFilters } from "../../../store/listingSearch/listingSearchCommon";
import { selectTotalListings } from "../../../store/listingSearch/listingSearchSelectors";
import { clearFilters } from "../../../store/filters/filtersSlice";
import Modal from "../../../components/design_system/modal/Modal/Modal";
import ModalHeader from "../../../components/design_system/modal/ModalHeader/ModalHeader";
import ModalBody from "../../../components/design_system/modal/ModalBody/ModalBody";
import Footer from "../../../components/design_system/Footer/Footer";
import More from "../../More/More";
import TextButton from "../../../components/design_system/TextButton/TextButton";
import ContainedButton from "../../../components/design_system/ContainedButton/ContainedButton";

const showListingsMessage = (n: number) =>
  `Show ${n.toLocaleString()} ${n === 1 ? "Home" : "Homes"}`;

const FiltersModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const modalOpen = useAppSelector(selectFiltersModalOpen);
  const totalListings = useAppSelector(selectTotalListings);

  const handleClose = useCallback(() => dispatch(closeModal()), [dispatch]);

  const handleClearAll = useCallback(() => {
    dispatch(clearFilters());
    dispatch(searchWithUpdatedFilters());
  }, [dispatch]);

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
        <TextButton onClick={handleClearAll}>Clear All</TextButton>
        <ContainedButton onClick={handleClose}>
          {showListingsMessage(totalListings)}
        </ContainedButton>
      </Footer>
    </Modal>
  );
};

export default FiltersModal;
