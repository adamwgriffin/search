import { render, screen } from "@testing-library/react";
import RadioButton from "./RadioButton";

describe("RadioButton", () => {
  it("Displays a label", () => {
    render(<RadioButton name="beds_min" label="Any" value={0} />);
    expect(screen.getByLabelText("Any")).toBeInTheDocument();
  });

  it("Uses the name prop to create a unique ID for the input", () => {
    render(
      <>
        <RadioButton name="beds_min" label="Any" value={0} />
        <RadioButton name="beds_min" label="0+" value={1} />
      </>
    );
    const inputOne = screen.getByLabelText("Any");
    const inputTwo = screen.getByLabelText("0+");
    expect(inputOne.id).toMatch(/^beds_min.+/);
    expect(inputOne.id).not.toMatch(inputTwo.id);
  });
});
