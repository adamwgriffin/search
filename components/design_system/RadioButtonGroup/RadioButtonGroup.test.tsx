import { render, screen, logRoles } from "@testing-library/react";
import RadioButtonGroup from "./RadioButtonGroup";

const options = [
  { label: "Any", value: 0 },
  { label: "1+", value: 1 }
];

describe("RadioButtonGroup", () => {
  beforeEach(() => {
    render(<RadioButtonGroup name="beds_min" label="Beds" options={options} />);
  });

  it("Displays a heading for the group using the label prop", () => {
    expect(screen.getByText("Beds")).toBeInTheDocument();
  });

  it("Renders a RadioButton for each option provided in the options prop", () => {
    options.forEach((o) => {
      expect(screen.getByLabelText(o.label)).toBeInTheDocument();
    });
  });
});
