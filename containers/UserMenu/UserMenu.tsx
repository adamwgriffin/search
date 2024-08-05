'use client'

import type { NextPage } from 'next'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { useToggle } from 'react-use'
import { useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useAppDispatch } from '../../hooks/app_hooks'
import { openModal } from '../../store/application/applicationSlice'
import { resetCurrentUser } from '../../store/user/userSlice'
import styles from './UserMenu.module.css'
import MenuContainter from '../../components/design_system/MenuContainter/MenuContainter'
import MenuDropdown from '../../components/design_system/MenuDropdown/MenuDropdown'
import HamburgerIcon from '../../components/design_system/icons/HamburgerIcon/HamburgerIcon'
import ThemeSwitcher from '../../components/header/ThemeSwitcher/ThemeSwitcher'
import Avatar from '../../components/header/Avatar/Avatar'

const UserMenu: NextPage = () => {
  const dispatch = useAppDispatch()
  const { data: session } = useSession()
  const [open, toggleMenu] = useToggle(false)

  const handleLogout = useCallback(async () => {
    toggleMenu(false)
    await signOut({ redirect: false })
    dispatch(resetCurrentUser())
  }, [dispatch, toggleMenu])

  const handleLogin = useCallback(() => {
    toggleMenu(false)
    dispatch(
      openModal({
        modalType: 'loginOrRegister',
        modalProps: { title: 'Login or Sign Up' }
      })
    )
  }, [dispatch, toggleMenu])

  return (
    <MenuContainter onClickAway={() => toggleMenu(false)}>
      <button className={styles.menuButton} onClick={toggleMenu}>
        <HamburgerIcon active={open} />
      </button>
      <MenuDropdown open={open} alignRight>
        {session?.user ? (
          <>
            <header className={styles.header}>
              <Avatar src={session?.user?.image} />
              <h1 className={styles.name}>{session?.user?.name}</h1>
            </header>
            <ul className={styles.menuListWithSeparator}>
              <li className={styles.menuItem}>
                <Link href='/account' className={styles.link}>
                  My Account
                </Link>
              </li>
              <li className={styles.menuItem}>
                <Link href='/account/favorites' className={styles.link}>
                  Saved Homes
                </Link>
              </li>
              <li className={styles.menuItem}>
                <Link href='/account/saved_searches' className={styles.link}>
                  Saved Searches
                </Link>
              </li>
            </ul>
            <ul className={styles.menuListWithSeparator}>
              <li className={styles.menuItem}>
                <div className={styles.menuItemContainer}>
                  <ThemeSwitcher />
                </div>
              </li>
              <li onClick={handleLogout} className={styles.menuItem}>
                <div className={styles.menuItemContainer}>Log Out</div>
              </li>
            </ul>
          </>
        ) : (
          <ul className={styles.menuList}>
            <li className={styles.menuItem}>
              <div className={styles.menuItemContainer}>
                <ThemeSwitcher />
              </div>
            </li>
            <li onClick={handleLogin} className={styles.menuItem}>
              <div className={styles.menuItemContainer}>Log in</div>
            </li>
          </ul>
        )}
      </MenuDropdown>
    </MenuContainter>
  )
}

export default UserMenu
