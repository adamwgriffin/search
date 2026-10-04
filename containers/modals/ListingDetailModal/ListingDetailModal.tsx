"use client";

import { useQuery, skipToken } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "../../../hooks/app_hooks";
import {
  selectListingDetailModalOpen,
  selectListingModalSlug,
  closeModal
} from "../../../store/application/applicationSlice";
import Modal from "../../../components/design_system/modal/Modal/Modal";
import ModalHeader from "../../../components/design_system/modal/ModalHeader/ModalHeader";
import ModalBody from "../../../components/design_system/modal/ModalBody/ModalBody";
import ListingDetail from "../../../components/listings/listing_detail/ListingDetail/ListingDetail";
import LoadingDots from "../../../components/design_system/LoadingDots/LoadingDots";
import styles from "./ListingDetailModal.module.css";
import { fetchListingDetail } from "@/lib/fetchListings";

const ListingDetailModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const modalOpen = useAppSelector(selectListingDetailModalOpen);
  const listingSlug = useAppSelector(selectListingModalSlug);

  const {
    data: listing,
    error,
    isFetching
  } = useQuery({
    queryKey: ["listingSlug", listingSlug],
    queryFn: listingSlug ? () => fetchListingDetail(listingSlug) : skipToken
  });

  return (
    <Modal
      isOpen={modalOpen}
      contentLabel="Listing Detail"
      fullScreenOnMobile={true}
    >
      <ModalHeader title="" onClose={() => dispatch(closeModal())} />
      <ModalBody>
        {isFetching && (
          <div className={styles.loadingState}>
            <LoadingDots />
          </div>
        )}
        {listingSlug && listing && <ListingDetail listing={listing} />}
        {error && (
          <div className={styles.loadingState}>Something went wrong :(</div>
        )}
      </ModalBody>
    </Modal>
  );
};

export default ListingDetailModal;
