import type { ListingDetail } from '../../../../types/listing_types'
import { getPropertyTypeLabel } from '../../../../lib/property_types'
import styles from './HomeHighlights.module.css'

export type HomeHighlightsProps = {
  listing: ListingDetail
}

const HomeHighlights: React.FC<HomeHighlightsProps> = ({ listing }) => {
  return (
    <div>
      <h4 className={styles.heading}>Home Highlights</h4>
      <ul className={styles.detailsList}>
        <li>
          <div className={styles.detailsName}>Property Type</div>
          <div>{getPropertyTypeLabel(listing.propertyType)}</div>
        </li>
        {listing.daysOnMarket && (
          <li>
            <div className={styles.detailsName}>Time on Site</div>
            <div>
              {`${listing.daysOnMarket.toLocaleString()} ${
                listing.daysOnMarket > 1 ? 'days' : 'day'
              }`}
            </div>
          </li>
        )}
        <li>
          <div className={styles.detailsName}>Year Built</div>
          <div>{listing.yearBuilt}</div>
        </li>
      </ul>
    </div>
  )
}

export default HomeHighlights
