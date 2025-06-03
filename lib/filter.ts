import type { CountOption } from "../types";
import type { FeatureLabelsType } from "../store/filters/filtersTypes";

export const SearchTypes = {
  Buy: "buy",
  Rent: "rent",
  Sold: "sold"
} as const;

export const SearchTypeLabels = {
  [SearchTypes.Buy]: "For Sale",
  [SearchTypes.Rent]: "For Rent",
  [SearchTypes.Sold]: "Sold"
};

export const LotSizeValues: Array<CountOption> = [
  {
    label: "No Min",
    value: 0
  },
  {
    label: "2,000+ sqft",
    value: 2000
  },
  {
    label: "3,000+ sqft",
    value: 3000
  },
  {
    label: "5,000+ sqft",
    value: 5000
  },
  {
    label: "7,500+ sqft",
    value: 7500
  },
  {
    label: "0.25+ acre",
    value: 10890
  },
  {
    label: "0.5+ acre",
    value: 21780
  },
  {
    label: "1+ acre",
    value: 43560
  },
  {
    label: "2+ acre",
    value: 87120
  },
  {
    label: "5+ acre",
    value: 217800
  },
  {
    label: "10+ acre",
    value: 435600
  }
];

export const FeatureLabels: FeatureLabelsType = {
  waterfront: "Waterfront",
  view: "Views",
  fireplace: "Fireplace",
  basement: "Basement",
  garage: "Garage",
  newConstruction: "New Construction",
  pool: "Pool",
  airConditioning: "Air Conditioning"
};
