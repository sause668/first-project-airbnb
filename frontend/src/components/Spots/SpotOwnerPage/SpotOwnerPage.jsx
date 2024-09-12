import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import './SpotOwner.css';
import * as spotActions from '../../../store/spot';
import OpenModalButton from '../../OpenModalButton/OpenModalButton';
import SpotDelete from '../SpotDeleteModal/SpotDeleteModal';

function SpotSearch() {
    const dispatch = useDispatch();
    const spotsOwner = useSelector(state => state.spot.spotsOwner);
    const navigate = useNavigate();
  
    // dispatch(spotActions.fetchSpots())
//   const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(spotActions.fetchSpotsOwner())
  }, [dispatch]);
  
    return (
        <div id='spotSearchContainer'>
            <h1>Manage Your Spots</h1>
            <button onClick={() => navigate(`/spots/new`)}>Create a New Spot</button>
            <ul>
                {(spotsOwner) ? spotsOwner.Spots.map((spot, index) => (
                    <li key={`searchSpots${index}`}>
                        <div className='spotsCard'>
                            <img className='spotsCardImg' src="" alt="Preview Image" />
                            <div className='spotsCardInfo'>
                                <h5>{`${spot.city},${spot.state}`}</h5>
                                <h5>{/*startIcon*/}{spot.avgRating}</h5>
                                <h5><b>${spot.price}</b> night</h5>
                                <button onClick={() => navigate(`/spots/${spot.id}/edit`)}>Update</button>
                                <OpenModalButton 
                                    modalComponent={<SpotDelete/>} // component to render inside the modal
                                    buttonText={'Delete'} // text of the button that opens the modal
                                    // onButtonClick, // optional: callback function that will be called once the button that opens the modal is clicked
                                    // onModalClose // optional: callback function that will be called once the modal is closed
                                />
                            </div>
                        </div>
                    </li>
                )) : null}
            </ul>
        </div>
    );
}

export default SpotSearch;