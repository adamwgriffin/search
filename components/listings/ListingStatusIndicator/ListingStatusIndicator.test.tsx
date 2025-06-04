import { render, screen } from "@testing-library/react";
import ListingStatusIndicator from "./ListingStatusIndicator";
import capitalize from "lodash/capitalize";

describe("ListingStatusIndicator", () => {
  it("renders 'Active' status with correct style", () => {
    render(<ListingStatusIndicator status="active" />);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("renders 'Pending' status with correct style", () => {
    render(<ListingStatusIndicator status="pending" />);
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  it("renders 'Sold' status with correct style", () => {
    render(<ListingStatusIndicator status="sold" />);
    expect(screen.getByText("Sold")).toBeInTheDocument();
  });

  it("renders 'Rented' status with correct style", () => {
    render(<ListingStatusIndicator status="rented" />);
    expect(screen.getByText("Rented")).toBeInTheDocument();
  });

  it("renders a capitalized version of the status string if it's not recognized", () => {
    const unrecogized = "unrecognized";
    // @ts-expect-error
    render(<ListingStatusIndicator status={unrecogized} />);
    expect(screen.queryByText(capitalize(unrecogized))).toBeInTheDocument();
  });
});
