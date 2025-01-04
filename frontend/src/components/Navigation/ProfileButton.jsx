import { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { FaUserCircle } from 'react-icons/fa';
import { IoMenu } from "react-icons/io5";

import './Navigation.css';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal/LoginFormModal';
import SignupFormModal from '../SignupFormModal/SignupFormModel';


function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout())
    .then(closeMenu)
    .then(() => navigate('/'));
  };

  const ulClassName = showMenu ? "conProfileMenu" : "hidden";

  return (
    <>
      <button onClick={toggleMenu} id='profileMenuButton' className='curser'>
        <IoMenu id='menuIcon'/><FaUserCircle id='profileIcon'/>
      </button>
      <div className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <div className='profileList'>
                <p className='profileListItem'>Hello {user.firstName}</p>
                <p className='profileListItem'>{user.email}</p>
            </div>
            <p id='profileListBorder'/>
            <div className='profileList'>
                <p className='profileListItem'>
                  <NavLink className='profileLink' to={'/spots/current'} onClick={closeMenu}>Manage Spots</NavLink>
                </p>
                <p className='profileListItem'>
                    <NavLink className='profileLink' to={'/reviews/current'} onClick={closeMenu}>Manage Reviews</NavLink>
                </p>
                <p className='profileListItem'>
                    <NavLink className='profileLink' to={'/bookings/current'} onClick={closeMenu}>Manage Bookings</NavLink>
                </p>
            </div>
            <div>
              <button id='logoutButton' onClick={logout}>Log Out</button>
            </div>
          </>
        ) : (
          <>
            <OpenModalMenuItem
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
            <OpenModalMenuItem
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal navigate={navigate}/>}
            />
          </>
        )}
      </div>
    </>
  );
}

export default ProfileButton;