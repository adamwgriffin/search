"use client";

import FiltersButton from "@/components/form/FiltersButton/FiltersButton";
import { useAppDispatch } from "@/hooks/app_hooks";
import { openModal } from "@/store/application/applicationSlice";

const FiltersButtonContainer: React.FC = () => {
  const dispatch = useAppDispatch();

  return (
    <FiltersButton
      onClick={() => {
        dispatch(openModal({ modalType: "filters" }));
      }}
    />
  );
};

export default FiltersButtonContainer;
