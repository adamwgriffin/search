"use client";

import FiltersButton from "@/components/form/FiltersButton/FiltersButton";
import { openModal } from "@/store/applicationStore";

const FiltersButtonContainer: React.FC = () => {
  return (
    <FiltersButton
      onClick={() => {
        openModal({ modalType: "filters" });
      }}
    />
  );
};

export default FiltersButtonContainer;
