import type { NextPage } from 'next'
import { useAppDispatch } from '../../hooks'
import { searchNewLocation } from '../../store/listingSearch/listingSearchSlice'
import styles from './SearchHeader.module.css'
import Logo from '../../components/header/Logo/Logo'
import SearchFieldContainer from '../SearchFieldContainer/SearchFieldContainer'
import Filters from '../Filters/Filters'
import Login from '../../components/header/Login/Login'

const SearchHeader: NextPage = () => {
  const dispatch = useAppDispatch()
  const runNewSearch = () => dispatch(searchNewLocation())

  return (
    <header className={styles.header}>
      <Logo />
      <SearchFieldContainer
        onSearchInitiated={runNewSearch}
        onOptionSelected={runNewSearch}
      />
      <div className={styles.controls}>
        <Login />
      </div>
      <div className={styles.filters}>
        <Filters />
      </div>
    </header>
  )
}

export default SearchHeader