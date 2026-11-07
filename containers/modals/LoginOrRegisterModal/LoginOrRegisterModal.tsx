"use client";

import {
  selectLoginOrRegisterModalOpen,
  closeModal,
  useApplicationStore
} from "@/store/applicationStore";
import Modal from "@/components/design_system/modal/Modal/Modal";
import ModalHeader from "@/components/design_system/modal/ModalHeader/ModalHeader";
import ModalBody from "@/components/design_system/modal/ModalBody/ModalBody";
import LoginOrRegisterForm from "@/components/form/LoginOrRegisterForm/LoginOrRegisterForm";

const LoginOrRegisterModal: React.FC = () => {
  const modalOpen = useApplicationStore(selectLoginOrRegisterModalOpen);

  const handleClose = closeModal;

  return (
    <Modal isOpen={modalOpen} contentLabel="Login" onRequestClose={handleClose}>
      <ModalHeader title="Login or Sign Up" onClose={handleClose} />
      <ModalBody>
        <LoginOrRegisterForm onFormSuccess={handleClose} />
      </ModalBody>
    </Modal>
  );
};

export default LoginOrRegisterModal;
