import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PriceRange, { maxLabel, minLabel } from './PriceRange'
import { formatAbbreviatedPrice } from '../../../lib/listing_helpers'

describe('PriceRange', () => {
  it('includes a Min Price field', () => {
    render(<PriceRange priceRange={{ priceMin: null, priceMax: null }} />)
    expect(screen.getByLabelText(minLabel)).toBeInTheDocument()
  })

  it('includes a Max Price field', () => {
    render(<PriceRange priceRange={{ priceMin: null, priceMax: null }} />)
    expect(screen.getByLabelText(maxLabel)).toBeInTheDocument()
  })

  describe('when one of the inputs receives focus', () => {
    it('opens the menu for the focused input, and closes the menu of the other', async () => {
      const user = userEvent.setup()
      render(<PriceRange priceRange={{ priceMin: null, priceMax: null }} />)
      const minPrice = screen.getByLabelText(minLabel)
      await user.click(within(minPrice).getByRole('button'))
      const minPricelistbox = within(minPrice).getByRole('listbox')
      expect(minPricelistbox).toBeVisible()
      const maxPrice = screen.getByLabelText(maxLabel)
      await user.click(within(maxPrice).getByRole('combobox'))
      const maxPriceListbox = within(maxPrice).getByRole('listbox')
      expect(maxPriceListbox).toBeVisible()
      expect(minPricelistbox).not.toBeVisible()
    })

    describe('when the escape key is clicked', () => {
      it('closes the menu', async () => {
        const user = userEvent.setup()
        render(<PriceRange priceRange={{ priceMin: null, priceMax: null }} />)
        const minPrice = screen.getByLabelText(minLabel)
        const combobox = within(minPrice).getByRole('combobox')
        await user.click(combobox)
        const minPricelistbox = within(minPrice).getByRole('listbox')
        expect(minPricelistbox).toBeVisible()
        await user.keyboard('{Escape}')
        expect(minPricelistbox).not.toBeVisible()
      })

      it('prevents the escape key event from bubbling up', async () => {
        const user = userEvent.setup()
        const onKeyUp = jest.fn()
        render(
          <div onKeyUp={onKeyUp}>
            <PriceRange priceRange={{ priceMin: null, priceMax: null }} />
          </div>
        )
        const minPrice = screen.getByLabelText(minLabel)
        const combobox = within(minPrice).getByRole('combobox')
        await user.click(combobox)
        await user.keyboard('{Escape}')
        expect(onKeyUp).not.toHaveBeenCalled()
      })
    })

    describe('when the up/down arrow keys are clicked', () => {
      it('opens the menu', async () => {
        const user = userEvent.setup()
        render(<PriceRange priceRange={{ priceMin: null, priceMax: null }} />)
        const minPrice = screen.getByLabelText(minLabel)
        const combobox = within(minPrice).getByRole('combobox')
        await user.click(combobox)
        const minPricelistbox = within(minPrice).getByRole('listbox')
        expect(minPricelistbox).toBeVisible()
        await user.keyboard('{Escape}')
        expect(minPricelistbox).not.toBeVisible()
        await user.keyboard('{ArrowUp}')
        expect(minPricelistbox).toBeVisible()
        await user.keyboard('{Escape}')
        expect(minPricelistbox).not.toBeVisible()
        await user.keyboard('{ArrowDown}')
        expect(minPricelistbox).toBeVisible()
      })
    })
  })

  it('filters the available prices in the listbox menu based on the chosen value in the other input', async () => {
    const priceRange = { priceMin: 50_000, priceMax: 100_000 }
    const minFormatted = formatAbbreviatedPrice(priceRange.priceMin)
    const maxFormatted = formatAbbreviatedPrice(priceRange.priceMax)
    const user = userEvent.setup()

    render(<PriceRange priceRange={priceRange} />)

    const minPrice = screen.getByLabelText(minLabel)
    await user.click(within(minPrice).getByRole('button'))
    const minPriceValues = within(minPrice)
      .getAllByRole('option')
      .map((o) => o.textContent)
    expect(minPriceValues).toContain(minFormatted)
    expect(minPriceValues).not.toContain(maxFormatted)

    const maxPrice = screen.getByLabelText(maxLabel)
    await user.click(within(maxPrice).getByRole('button'))
    const maxPriceValues = within(maxPrice)
      .getAllByRole('option')
      .map((o) => o.textContent)
    expect(maxPriceValues).toContain(maxFormatted)
    expect(maxPriceValues).not.toContain(minFormatted)
  })
})
