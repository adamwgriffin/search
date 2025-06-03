import type { PriceRangeFilters } from "../../../store/filters/filtersTypes";
import { type KeyboardEvent, useState } from "react";
import Price from "../Price/Price";
import InputRangeSeparator from "../../design_system/InputRangeSeparator/InputRangeSeparator";
import styles from "./PriceRange.module.css";

export type PriceRangeProps = {
  priceRange: PriceRangeFilters;
  onFocus?: () => void;
  onBlur?: () => void;
  onChange?: (priceRange: Partial<PriceRangeFilters>) => void;
  onMenuItemSelected?: (priceRange: Partial<PriceRangeFilters>) => void;
};

export const prices = [
  0, 50_000, 100_000, 150_000, 200_000, 250_000, 300_000, 350_000, 400_000,
  450_000, 500_000, 550_000, 600_000, 650_000, 700_000, 750_000, 800_000,
  850_000, 900_000, 950_000, 1_000_000, 1_250_000, 1_500_000, 1_750_000,
  2_000_000, 2_250_000, 2_500_000, 2_750_000, 3_000_000, 3_250_000, 3_500_000,
  3_750_000, 4_000_000, 4_250_000, 4_500_000, 4_750_000, 5_000_000, 6_000_000,
  7_000_000, 8_000_000, 9_000_000, 10_000_000, 11_000_000, 12_000_000,
  13_000_000, 14_000_000, 15_000_000, 16_000_000, 17_000_000, 18_000_000
];

export const minLabel = "Min Price";
export const maxLabel = "Max Price";

const PriceRange: React.FC<PriceRangeProps> = ({
  priceRange,
  onFocus,
  onBlur,
  onChange,
  onMenuItemSelected
}) => {
  const [minOpen, setMinOpen] = useState(false);
  const [maxOpen, setMaxOpen] = useState(false);

  const minOptions = () => {
    const { priceMax } = priceRange;
    return priceMax === null
      ? prices
      : prices.filter((price) => price < priceMax);
  };

  const maxOptions = () => {
    const { priceMin } = priceRange;
    return priceMin === null
      ? prices
      : prices.filter((price) => price === 0 || price > priceMin); // Always keep 0 for "Any"
  };

  const handleMinFocus = () => {
    onFocus?.();
    setMaxOpen(false);
    setMinOpen(true);
  };

  const handleMaxFocus = () => {
    onFocus?.();
    setMinOpen(false);
    setMaxOpen(true);
  };

  // We want to prevent the escape key event from bubbling when a menu is open
  // because otherwise the mobile filters modal will receive it and close the
  // modal when what we really want is to close the menu instead
  const checkPropogationForKey = (
    e: KeyboardEvent<HTMLInputElement>,
    open: boolean
  ) => {
    if (e.key === "Escape" && open) {
      e.stopPropagation();
    }
  };

  return (
    <fieldset className={styles.price}>
      <legend className={styles.legend}>Price Range</legend>

      <Price
        label={minLabel}
        placeholder="Min"
        price={priceRange.priceMin}
        options={minOptions()}
        menuOpen={minOpen}
        onFocus={handleMinFocus}
        onBlur={onBlur}
        onClickAway={() => setMinOpen(false)}
        onMenuButtonClick={() => setMinOpen(!minOpen)}
        onKeyUp={(e) => {
          checkPropogationForKey(e, minOpen);
          if (e.key === "Escape") {
            setMinOpen(false);
          }
        }}
        onKeyDown={(e) => {
          checkPropogationForKey(e, minOpen);
          if (e.key === "ArrowUp" || e.key === "ArrowDown") {
            setMinOpen(true);
          }
        }}
        onMenuItemSelected={(priceMin) => {
          setMinOpen(false);
          onMenuItemSelected?.({ priceMin });
        }}
        onChange={(priceMin) => onChange?.({ priceMin })}
      />

      <InputRangeSeparator />

      <Price
        label={maxLabel}
        placeholder="Max"
        price={priceRange.priceMax}
        options={maxOptions()}
        menuOpen={maxOpen}
        onFocus={handleMaxFocus}
        onBlur={onBlur}
        onClickAway={() => setMaxOpen(false)}
        onMenuButtonClick={() => setMaxOpen(!maxOpen)}
        onKeyUp={(e) => {
          checkPropogationForKey(e, maxOpen);
          if (e.key === "Escape") {
            setMaxOpen(false);
          }
        }}
        onKeyDown={(e) => {
          checkPropogationForKey(e, maxOpen);
          if (e.key === "ArrowUp" || e.key === "ArrowDown") {
            setMaxOpen(true);
          }
        }}
        onMenuItemSelected={(priceMax) => {
          setMaxOpen(false);
          onMenuItemSelected?.({ priceMax });
        }}
        onChange={(priceMax) => onChange?.({ priceMax })}
      />
    </fieldset>
  );
};

export default PriceRange;
