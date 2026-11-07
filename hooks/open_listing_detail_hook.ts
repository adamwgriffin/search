import { useMedia } from "react-use";
import { openModal } from "@/store/applicationStore";

export const addUrlToBrowserHistory = (url: string) => {
  const currentUrl = window.location.href;
  history.replaceState({}, "", url);
  history.replaceState({}, "", currentUrl);
};

export const useOpenListingDetail = (addUrlOnModalOpen = true) => {
  const isSmallAndUp = useMedia("(min-width: 576px)", false);

  return (url: string, listingSlug: string) => {
    if (isSmallAndUp) {
      window.open(url, "_blank");
    } else {
      openModal({
        modalType: "listingDetail",
        modalProps: { listingSlug }
      });
      if (addUrlOnModalOpen) addUrlToBrowserHistory(url);
    }
  };
};
