import { render, screen } from "@testing-library/react";
import { testListing } from "../../../data/test_data/testListing";
import type { Listing } from "../../../types/listing_types";
import ListingInfo from "./ListingInfo";

const bedsRegex = /[0-9]+bd/;
const bathsRegex = /[0-9]+ba/;

describe("ListingCardInfo", () => {
  it("only renders lot size for a land property type", () => {
    const landListing: Listing = {
      ...testListing,
      propertyType: "land",
      lotSize: 10_000,
      beds: 0,
      baths: 0,
      sqft: 0
    };
    render(<ListingInfo listing={landListing} />);
    expect(screen.queryByText(bedsRegex)).not.toBeInTheDocument();
    expect(screen.queryByText(bathsRegex)).not.toBeInTheDocument();
    expect(screen.queryByText(/[0-9,]+ (sqft|acre)+ lot/)).toBeInTheDocument();
  });

  it("renders beds, baths, and sqft for non-land property types", () => {
    render(<ListingInfo listing={testListing} />);
    expect(screen.queryByText(bedsRegex)).toBeInTheDocument();
    expect(screen.queryByText(bathsRegex)).toBeInTheDocument();
    expect(screen.queryByText(/[0-9,]+ sqft/)).toBeInTheDocument();
  });

  it("renders custom beds and baths labels", () => {
    render(
      <ListingInfo
        listing={testListing}
        bedsLabel=" Beds"
        bathsLabel=" Baths"
      />
    );
    expect(screen.queryByText(/[0-9]+ Beds/)).toBeInTheDocument();
    expect(screen.queryByText(/[0-9]+ Baths/)).toBeInTheDocument();
  });
});
