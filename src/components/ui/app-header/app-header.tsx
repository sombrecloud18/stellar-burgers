import React, { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { NavLink } from 'react-router-dom';
import { clsx } from 'clsx';
import { useSelector } from '../../../services/store';
import { Preloader } from '../preloader';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const userLoadingStatus = useSelector((state) => state.auth.isLoading);

  // Функция для определения типа иконки
  const getIconType = (isActive: boolean) =>
    isActive ? 'primary' : 'secondary';

  return userLoadingStatus ? (
    <Preloader />
  ) : (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <NavLink
            className={({ isActive }) =>
              clsx(styles.link, { [styles.link_active]: isActive })
            }
            to='/'
            end
          >
            {({ isActive }) => (
              <>
                <BurgerIcon type={getIconType(isActive)} />
                <p className='text text_type_main-default ml-2 mr-10'>
                  Конструктор
                </p>
              </>
            )}
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              clsx(styles.link, { [styles.link_active]: isActive })
            }
            to='/feed'
          >
            {({ isActive }) => (
              <>
                <ListIcon type={getIconType(isActive)} />
                <p className='text text_type_main-default ml-2'>
                  Лента заказов
                </p>
              </>
            )}
          </NavLink>
        </div>
        <NavLink to='/'>
          <div className={styles.logo}>
            <Logo className='' />
          </div>
        </NavLink>
        <div className={styles.link_position_last}>
          <NavLink
            className={({ isActive }) =>
              clsx(styles.link, { [styles.link_active]: isActive })
            }
            to='/profile'
          >
            {({ isActive }) => (
              <>
                <ProfileIcon type={getIconType(isActive)} />
                <p className='text text_type_main-default ml-2'>
                  {userName || 'Личный кабинет'}
                </p>
              </>
            )}
          </NavLink>
        </div>
      </nav>
    </header>
  );
};
