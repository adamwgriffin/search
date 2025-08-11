import { render, screen } from "@testing-library/react";
import BedsAndBaths from "./BedsAndBaths";
import { BedBathValues } from "./BedsAndBaths";

describe.skip("BedsAndBaths", () => {
  it("Renders a group for each type of data", () => {
    render(<BedsAndBaths />);
    BedBathValues.forEach((value) => {
      expect(
        screen.getByText(value === 0 ? 'Any' : `${value}+`)
      ).toBeInTheDocument();
    });
  });
});
