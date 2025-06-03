import { render, screen } from "@testing-library/react";
import { RadioButtonGroups } from "./beds_and_baths_helpers";
import BedsAndBaths from "./BedsAndBaths";

const bedsAndBaths = { bedsMin: 0, bathsMin: 0 };

describe("BedsAndBaths", () => {
  it("Renders a group for each type of data", () => {
    render(<BedsAndBaths bedsAndBaths={bedsAndBaths} />);
    RadioButtonGroups.forEach(({ label }) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it("Returns a partial BedsBathsParam when a radio button is clicked", () => {
    const onChange = jest.fn();
    render(<BedsAndBaths bedsAndBaths={bedsAndBaths} onChange={onChange} />);
    screen.getAllByText("1+")[0].click();
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith({ bedsMin: 1 });
  });
});
