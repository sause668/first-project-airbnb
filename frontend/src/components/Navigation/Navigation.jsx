import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <nav id='conMain'>
        <div id='conLogo'>
            <NavLink to="/">
                <img src="/airbnb-logo.svg" alt="Airbnb Logo" id='logo'/>
            </NavLink>
        </div>
        <div id='conNavRight'>
           {sessionUser ?
            <div id='conNewSpot'>
                <NavLink to={'/spots/new'} id='newSpot'>Create A New Spot</NavLink>
            </div>
        :null}
        {isLoaded && (
            <div id='conMenu'>
                <ProfileButton user={sessionUser} />
            </div>
        )} 
        </div>
        
    </nav>
    
  );
}

export default Navigation;