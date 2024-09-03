import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import LoginFormModal from '../LoginFormModal/LoginFormModal';
import SignupFormModal from '../SignupFormModal/SignupFormModel';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  let sessionLinks = [];
  if (sessionUser) {
    sessionLinks.push((
        <ProfileButton user={sessionUser} />
    ));
  } else {
    sessionLinks.push(
        (
            <OpenModalButton
            buttonText="Log In"
            modalComponent={<LoginFormModal />}
            />
        ),
        (
            <OpenModalButton
            buttonText="Sign Up"
            modalComponent={<SignupFormModal />}
            />
        )
    );
  }

  return (
    <ul>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      {isLoaded && sessionLinks.map((link, index) => (<li key={`sessionLink${index}`}>{link}</li>))}
    </ul>
  );
}

export default Navigation;