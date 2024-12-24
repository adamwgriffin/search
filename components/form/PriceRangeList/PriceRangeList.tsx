import { Fragment } from 'react'
import { formatAbbreviatedPrice } from '../../../lib/listing_helpers'
import styles from './PriceRangeList.module.css'

export type PriceRangeListProps = {
  onClick?: (price: number) => void
}

export const PriceRangeNumbers = [
  50_000, 100_000, 150_000, 200_000, 250_000, 300_000, 350_000, 400_000,
  450_000, 500_000, 550_000, 600_000, 650_000, 700_000, 750_000, 800_000,
  850_000, 900_000, 950_000, 1_000_000, 1_250_000, 1_500_000, 1_750_000,
  2_000_000, 2_250_000, 2_500_000, 2_750_000, 3_000_000, 3_250_000, 3_500_000,
  3_750_000, 4_000_000, 4_250_000, 4_500_000, 4_750_000, 5_000_000, 6_000_000,
  7_000_000, 8_000_000, 9_000_000, 10_000_000, 11_000_000, 12_000_000,
  13_000_000, 14_000_000, 15_000_000, 16_000_000, 17_000_000, 18_000_000
]

const PriceRangeList: React.FC<PriceRangeListProps> = ({ onClick }) => {
  return (
    <ul className={styles.priceList}>
      <li className={styles.priceListItem} onClick={() => onClick?.(0)}>
        Any
      </li>
      {PriceRangeNumbers.map((price) => {
        return (
          <Fragment key={price}>
            <li
              className={styles.priceListItem}
              onClick={() => onClick?.(price)}
            >
              {formatAbbreviatedPrice(price)}
            </li>
          </Fragment>
        )
      })}
    </ul>
  )
}

export default PriceRangeList
