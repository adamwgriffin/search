"use client";

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/app_hooks";
import {
  selectLoginOrRegisterModalOpen,
  closeModal
} from "../../../store/application/applicationSlice";
import Modal from "../../../components/design_system/modal/Modal/Modal";
import ModalHeader from "../../../components/design_system/modal/ModalHeader/ModalHeader";
import ModalBody from "../../../components/design_system/modal/ModalBody/ModalBody";
import LoginOrRegisterForm from "../../../components/form/LoginOrRegisterForm/LoginOrRegisterForm";

const LoginOrRegisterModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const modalOpen = useAppSelector(selectLoginOrRegisterModalOpen);

  const handleClose = useCallback(() => dispatch(closeModal()), [dispatch]);

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
