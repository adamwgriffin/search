import {
  selectMobileViewType,
  toggleMobileViewType
} from '../../../store/application/applicationSlice'
import { useAppDispatch, useAppSelector } from '../../../hooks/app_hooks'
import ListIcon from '../../design_system/icons/ListIcon/ListIcon'
import MapIcon from '../../design_system/icons/MapIcon/MapIcon'
import styles from './MobileViewSwitcher.module.css'

const ViewSwitcher: React.FC = () => {
  const dispatch = useAppDispatch()
  const mobileViewType = useAppSelector(selectMobileViewType)

  return (
    <button
      className={styles.viewSwitcher}
      onClick={() => {
        dispatch(
          toggleMobileViewType(mobileViewType === 'list' ? 'map' : 'list')
        )
      }}
    >
      {mobileViewType === 'list' ? (
        <>
          <MapIcon /> Map
        </>
      ) : (
        <>
          <ListIcon /> List
        </>
      )}
    </button>
  )
}

export default ViewSwitcher
