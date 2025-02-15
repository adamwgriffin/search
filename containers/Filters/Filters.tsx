import styles from './Filters.module.css'
import PriceMenuButton from '../../components/form/PriceMenuButton/PriceMenuButton'
import BedsAndBathsMenuButton from '../../components/form/BedsAndBathsMenuButton/BedsAndBathsMenuButton'
import MoreMenuButton from '../../components/form/MoreMenuButton/MoreMenuButton'
import FiltersButton from '../../components/form/FiltersButton/FiltersButton'
import MobileViewSwitcher from '../../components/form/MobileViewSwitcher/MobileViewSwitcher'
import SaveSearchButton from '../../components/form/SaveSearchButton/SaveSearchButton'

const Filters: React.FC = () => {
  return (
    <div className={styles.filters}>
      <PriceMenuButton />
      <BedsAndBathsMenuButton />
      <MoreMenuButton />
      <FiltersButton />
      <SaveSearchButton />
      <MobileViewSwitcher />
    </div>
  )
}

export default Filters
