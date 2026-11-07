import { create } from "zustand";

export type MobileViewType = "list" | "map";

export type ModalType =
  "filters" | "saveSearch" | "listingDetail" | "loginOrRegister";

export type ListingDetailModalProps = {
  listingSlug: string;
};

export type ModalPropsTypes = ListingDetailModalProps | null;

export type ApplicationState = {
  mobileViewType: MobileViewType;
  modalType: ModalType | null;
  modalProps: ModalPropsTypes;
  modalOpen: boolean;
  highlightedMarker: string | null;
};

export type OpenModalPayload = {
  modalType: ModalType;
  modalProps?: ModalPropsTypes;
};

const initialState: ApplicationState = {
  mobileViewType: "list",
  modalType: null,
  modalProps: null,
  modalOpen: false,
  highlightedMarker: null
};

export const useApplicationStore = create<ApplicationState>()(
  () => initialState
);

export const toggleMobileViewType = (mobileViewType: MobileViewType) =>
  useApplicationStore.setState({ mobileViewType });

export const openModal = ({ modalType, modalProps }: OpenModalPayload) =>
  useApplicationStore.setState({
    modalType,
    modalProps: modalProps ?? null,
    modalOpen: true
  });

export const closeModal = () =>
  useApplicationStore.setState({ modalOpen: false });

export const resetModal = () =>
  useApplicationStore.setState({
    modalType: initialState.modalType,
    modalProps: initialState.modalProps
  });

export const setHighlightedMarker = (
  highlightedMarker: ApplicationState["highlightedMarker"]
) => useApplicationStore.setState({ highlightedMarker });

const modalTypeOpen = (state: ApplicationState, modalType: ModalType) =>
  state.modalType === modalType && state.modalOpen;

export const selectMobileViewType = (state: ApplicationState) =>
  state.mobileViewType;

export const selectListingModalSlug = (state: ApplicationState) =>
  state.modalProps?.listingSlug;

export const selectFiltersModalOpen = (state: ApplicationState) =>
  modalTypeOpen(state, "filters");

export const selectSaveSearchModalOpen = (state: ApplicationState) =>
  modalTypeOpen(state, "saveSearch");

export const selectListingDetailModalOpen = (state: ApplicationState) =>
  modalTypeOpen(state, "listingDetail");

export const selectLoginOrRegisterModalOpen = (state: ApplicationState) =>
  modalTypeOpen(state, "loginOrRegister");

export const selectHighlightedMarker = (state: ApplicationState) =>
  state.highlightedMarker;
