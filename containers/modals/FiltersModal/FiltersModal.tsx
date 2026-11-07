"use client";

import { useSearchState } from "@/hooks/useSearchState";
import ContainedButton from "@/components/design_system/ContainedButton/ContainedButton";
import Footer from "@/components/design_system/Footer/Footer";
import Modal from "@/components/design_system/modal/Modal/Modal";
import ModalBody from "@/components/design_system/modal/ModalBody/ModalBody";
import ModalHeader from "@/components/design_system/modal/ModalHeader/ModalHeader";
import TextButton from "@/components/design_system/TextButton/TextButton";
import {
  closeModal,
  selectFiltersModalOpen,
  useApplicationStore
} from "@/store/applicationStore";
import More from "@/containers/More/More";
import { useSearchResults } from "@/hooks/useSearchResults";

const showListingsMessage = (n: number) =>
  `Show ${n.toLocaleString()} ${n === 1 ? "Home" : "Homes"}`;

const FiltersModal: React.FC = () => {
  const modalOpen = useApplicationStore(selectFiltersModalOpen);
  const { clearFilters } = useSearchState();
  const { data: results } = useSearchResults();

  return (
    <Modal
      isOpen={modalOpen}
      contentLabel="Filters"
      fullScreenOnMobile={true}
      onRequestClose={closeModal}
    >
      <ModalHeader title={"Filters"} onClose={closeModal} />
      <ModalBody>
        <More />
      </ModalBody>
      <Footer>
        <TextButton onClick={clearFilters}>Clear All</TextButton>
        <ContainedButton onClick={closeModal}>
          {showListingsMessage(results?.pagination?.numberAvailable ?? 0)}
        </ContainedButton>
      </Footer>
    </Modal>
  );
};

export default FiltersModal;
