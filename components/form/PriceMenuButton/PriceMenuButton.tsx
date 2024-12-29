import { useState } from 'react'
import MenuButton from '../../design_system/MenuButton/MenuButton'
import PriceContainer from '../../../containers/PriceContainer/PriceContainer'
import styles from './PriceMenuButton.module.css'

const PriceMenuButton: React.FC = () => {
  const [open, setOpen] = useState(false)

  return (
    <MenuButton
      label='Price'
      open={open}
      className={styles.menu}
      onClick={() => setOpen(!open)}
      onClickAway={() => setOpen(false)}
    >
      <PriceContainer />
    </MenuButton>
  )
}

export default PriceMenuButton
