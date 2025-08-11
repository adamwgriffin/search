export type PropertyType =
  | "single-family"
  | "condo"
  | "townhouse"
  | "manufactured"
  | "land"
  | "multi-family";

export type PropertyTypeIDArray = Array<PropertyType>;

export type PropertyTypeData = {
  id: PropertyType;
  label: string;
};

export const PropertyTypesData: PropertyTypeData[] = Object.seal([
  {
    id: "single-family",
    label: "House"
  },
  {
    id: "condo",
    label: "Condo"
  },
  {
    id: "townhouse",
    label: "Townhouse"
  },
  {
    id: "manufactured",
    label: "Manufactured"
  },
  {
    id: "land",
    label: "Land"
  },
  {
    id: "multi-family",
    label: "Multi-Family"
  }
]);

export const getPropertyTypeLabel = (propertyType: PropertyType) => {
  return PropertyTypesData.find((p) => p.id === propertyType)?.label;
};
