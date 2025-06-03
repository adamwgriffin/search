import type { AppState } from "..";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export type MobileViewType = "list" | "map";

export type ModalType =
  | "filters"
  | "saveSearch"
  | "listingDetail"
  | "loginOrRegister";

export type ListingDetailModalProps = {
  listingSlug: string;
};

export type ModalPropsTypes = ListingDetailModalProps | null;

export type ApplicationState = {
  mobileViewType: MobileViewType;
  modalType: ModalType | null;
  modalProps: ModalPropsTypes;
  modalOpen: boolean;
};

export type OpenModalPayload = {
  modalType: ModalType;
  modalProps?: ModalPropsTypes;
};

const initialState: ApplicationState = {
  mobileViewType: "list",
  modalType: null,
  modalProps: null,
  modalOpen: false
};

export const applicationSlice = createSlice({
  name: "application",

  initialState,

  reducers: {
    toggleMobileViewType(state, action: PayloadAction<MobileViewType>) {
      state.mobileViewType = action.payload;
    },

    openModal(state, action: PayloadAction<OpenModalPayload>) {
      state.modalType = action.payload.modalType;
      state.modalProps = action.payload.modalProps
        ? action.payload.modalProps
        : null;
      state.modalOpen = true;
    },

    closeModal(state) {
      state.modalOpen = false;
    },

    resetModal(state) {
      state.modalType = initialState.modalType;
      state.modalProps = initialState.modalProps;
    }
  }
});

export const { toggleMobileViewType, openModal, closeModal, resetModal } =
  applicationSlice.actions;

const modalTypeOpen = (state: AppState, modalType: ModalType) =>
  state.application.modalType === modalType && state.application.modalOpen;

export const selectMobileViewType = (state: AppState) =>
  state.application.mobileViewType;

export const selectListingModalSlug = (state: AppState) =>
  state.application.modalProps?.listingSlug;

export const selectFiltersModalOpen = (state: AppState) =>
  modalTypeOpen(state, "filters");

export const selectSaveSearchModalOpen = (state: AppState) =>
  modalTypeOpen(state, "saveSearch");

export const selectListingDetailModalOpen = (state: AppState) =>
  modalTypeOpen(state, "listingDetail");

export const selectLoginOrRegisterModalOpen = (state: AppState) =>
  modalTypeOpen(state, "loginOrRegister");

export default applicationSlice.reducer;
