import MenuOpenIcon from '../icons/MenuOpenIcon/MenuOpenIcon'
import OutlinedButton from '../OutlinedButton/OutlinedButton'
import styles from './ToggleOpenButton.module.css'

export type ToggleOpenButtonProps = {
  open: boolean
  label: string
  highlighted?: boolean
  condensed?: boolean
  onClick?: () => void
}

const ToggleOpenButton: React.FC<ToggleOpenButtonProps> = ({
  open = false,
  label,
  highlighted = false,
  condensed = false,
  onClick
}) => {
  return (
    <OutlinedButton
      highlighted={highlighted || open}
      onClick={onClick}
      condensed={condensed}
    >
      <span className={styles.label}>{label}</span>
      <MenuOpenIcon open={open} />
    </OutlinedButton>
  )
}

export default ToggleOpenButton
