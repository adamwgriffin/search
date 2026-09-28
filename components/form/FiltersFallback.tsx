import FiltersButton from "@/components/form/FiltersButton/FiltersButton";
import MenuButtonFallback from "@/components/form/MenuButtonFallback";
import MobileViewSwitcher from "@/components/form/MobileViewSwitcher/MobileViewSwitcher";
import SaveSearchButton from "@/components/form/SaveSearchButton/SaveSearchButton";

export default function FiltersFallback() {
  return (
    <>
      <MenuButtonFallback label="Price" />
      <MenuButtonFallback label="Beds & Baths" />
      <MenuButtonFallback label="More" />
      <FiltersButton loading disabled />
      <SaveSearchButton loading disabled />
      <MobileViewSwitcher />
    </>
  );
}
