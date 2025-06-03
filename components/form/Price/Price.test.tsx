import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Price from "./Price";
import { prices } from "../PriceRange/PriceRange";
import { formatAbbreviatedPrice } from "../../../lib/listing_helpers";

describe("Price", () => {
  it("formats the price that was entered", async () => {
    const testPrice = 100_000;
    render(<Price label="Min Price" price={null} options={prices} menuOpen />);
    const combobox = screen.getByRole("combobox");
    await userEvent.type(combobox, String(testPrice));
    expect(combobox).toHaveValue(formatAbbreviatedPrice(testPrice));
  });

  it("displays a placeholder", async () => {
    const placeholder = "Min";
    render(
      <Price
        label="Min Price"
        price={null}
        options={prices}
        menuOpen={false}
        placeholder={placeholder}
      />
    );
    const combobox = screen.getByRole("combobox");
    expect(combobox).toHaveAttribute("placeholder", placeholder);
  });

  it("opens a menu with a list of options", () => {
    render(<Price label="Min Price" price={null} options={prices} menuOpen />);
    const listbox = screen.getByRole("listbox");
    expect(listbox).toBeVisible();
    const options = screen.queryAllByRole("option");
    expect(options.length).toEqual(prices.length);
    options.forEach((option) => {
      expect(option).toBeVisible();
    });
  });
});
