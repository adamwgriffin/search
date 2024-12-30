import { render, screen } from '@testing-library/react'
import PriceRange from './PriceRange'

describe('PriceRange', () => {
  
  it('Includes a Min Price field', () => {
    render(<PriceRange priceRange={{ priceMin: null, priceMax: null }} />)
    expect(screen.getByRole('textbox', { name: 'Min Price' })).toBeInTheDocument()
  })

  it('Includes a Max Price field', () => {
    render(<PriceRange priceRange={{ priceMin: null, priceMax: null }}  />)
    expect(screen.getByRole('textbox', { name: 'Max Price' })).toBeInTheDocument()
  })

})
