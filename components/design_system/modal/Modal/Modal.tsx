import type { NextPage } from "next";
import type { ReactNode } from "react";
import styles from "./Modal.module.css";
import ReactModal from "react-modal";

export interface ModalProps {
  isOpen: boolean;
  contentLabel: string;
  closeTimeoutMS?: number;
  fullScreenOnMobile?: boolean;
  children: ReactNode;
  onRequestClose?: () => void;
  onAfterClose?: () => void;
}

const Modal: NextPage<ModalProps> = ({
  isOpen = false,
  contentLabel,
  closeTimeoutMS = 500,
  fullScreenOnMobile = false,
  children,
  onRequestClose,
  onAfterClose
}) => {
  const modalContentClassNameBase = fullScreenOnMobile
    ? styles.modalContentFullScreenOnMobile
    : styles.modalContent;
  const modalOverlayClassNameBase = fullScreenOnMobile
    ? styles.modalOverlayFullScreenOnMobile
    : styles.modalOverlay;

  return (
    // Setting ariaHideApp=false because it tries to set aria-hidden on the
    // <body> tag by default, which is not allowed. According to
    // https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/dialog/
    // the aria-hidden attribute is no longer required if you use aria-modal,
    // which React-Modal does. The aria-modal attribute has been around quite a
    // while now and has very good screen reader support so we're opting out of
    // this for now.
    <ReactModal
      ariaHideApp={false}
      isOpen={isOpen}
      contentLabel={contentLabel}
      overlayClassName={{
        base: modalOverlayClassNameBase,
        afterOpen: styles.modalOverlayAfterOpen,
        beforeClose: styles.modalOverlayBeforeClose
      }}
      className={{
        base: modalContentClassNameBase,
        afterOpen: styles.modalContentAfterOpen,
        beforeClose: styles.modalContentBeforeClose
      }}
      onRequestClose={onRequestClose}
      onAfterClose={onAfterClose}
      closeTimeoutMS={closeTimeoutMS}
    >
      {/* TODO: Change this once React Modal is fixed.
      Using <> is just a hacky workaround for the fact
      that the types used in @types/react 19 do not align
      with the older React types used by @types/react-modal.
      See: https://github.com/vercel/next.js/discussions/64753#discussioncomment-9236067 */}
      <>{children}</>
    </ReactModal>
  );
};

export default Modal;
