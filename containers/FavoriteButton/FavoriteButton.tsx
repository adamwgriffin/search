import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { useAppSelector, useAppDispatch } from '../../hooks/app_hooks'
import { selectFavoriteIds, toggleFavorite } from '../../store/user/userSlice'
import { openModal } from '../../store/application/applicationSlice'
import styles from './FavoriteButton.module.css'
import HeartIcon from '../../components/design_system/icons/HeartIcon/HeartIcon'

export interface FavoriteButtonProps {
  listingId: string
}

const FavoriteButton: NextPage<FavoriteButtonProps> = ({ listingId }) => {
  const dispatch = useAppDispatch()
  const { data: session } = useSession()
  const favoriteIds = useAppSelector(selectFavoriteIds)

  const toggleFavoriteOrOpenModal = () => {
    if (session?.user) {
      dispatch(toggleFavorite(listingId))
    } else {
      dispatch(openModal({ modalType: 'loginOrRegister' }))
    }
  }

  return (
    <button
      className={styles.favoriteButton}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleFavoriteOrOpenModal()
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          toggleFavoriteOrOpenModal()
        }
      }}
    >
      <HeartIcon
        id={
          favoriteIds.includes(listingId)
            ? styles.favoriteStroke
            : styles.favoriteFilled
        }
      />
    </button>
  )
}

export default FavoriteButton
