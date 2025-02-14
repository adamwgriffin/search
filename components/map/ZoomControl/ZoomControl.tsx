import type { NextPage } from 'next'
import styles from './ZoomControl.module.css'
import PlusIcon from '../../design_system/icons/PlusIcon/PlusIcon'
import MinusIcon from '../../design_system/icons/MinusIcon/MinusIcon'

export interface ZoomControlProps {
  onZoomIn?: () => void
  onZoomOut?: () => void
}

const ZoomControl: NextPage<ZoomControlProps> = ({ onZoomIn, onZoomOut }) => {
  return (
    <div className={styles.zoomControl}>
      <button aria-label='Zoom in' className={styles.zoomIn} onClick={onZoomIn}>
        <PlusIcon className={styles.icon} />
      </button>
      <button
        aria-label='Zoom out'
        className={styles.zoomOut}
        onClick={onZoomOut}
      >
        <MinusIcon className={styles.icon} />
      </button>
    </div>
  )
}

export default ZoomControl
