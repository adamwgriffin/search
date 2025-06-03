import type { NextPage } from 'next'
import styles from './MenuOpenIcon.module.css'

export interface MenuOpenIconProps {
  open: boolean
}

const MenuOpenIcon: NextPage<MenuOpenIconProps> = ({ open }) => {
  return (
    <svg
      aria-hidden='true'
      className={open ? styles.open : styles.closed}
      xmlns='http://www.w3.org/2000/svg'
      width='12'
      height='8'
    >
      <path fillRule='evenodd' d='M10.59.59 6 5.17 1.41.59 0 2l6 6 6-6z' />
    </svg>
  )
}

export default MenuOpenIcon
