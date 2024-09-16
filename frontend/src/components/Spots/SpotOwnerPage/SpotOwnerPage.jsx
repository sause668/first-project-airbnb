import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaStar } from "react-icons/fa";
import './SpotOwner.css';
import * as spotActions from '../../../store/spot';
import OpenModalButton from '../../OpenModalButton/OpenModalButton';
import SpotDelete from '../SpotDeleteModal/SpotDeleteModal';

function SpotSearch() {
    const dispatch = useDispatch();
    const spotsOwner = useSelector(state => state.spot.spotsOwner);
    const navigate = useNavigate();
    const user = useSelector(state => state.session.user);
    const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!user) navigate('/');
    else dispatch(spotActions.fetchSpotsOwner())
    .then(() => setIsLoaded(true));
  }, [dispatch, navigate, user]);
  
    return (
        <div id='spotsOwnerCon'>
            <div id='spotTitleCon'>
                <h1 id='spotTitle'>Manage Your Spots</h1>
                <button className='actionButton' onClick={() => navigate(`/spots/new`)}>Create a New Spot</button>
            </div>
            <div id='spotsCon'>
                <div id='spotsSearchGrid'>
                    {(isLoaded) ? spotsOwner.Spots.map((spot, index) => (
                            <div className='spotCard' key={`spotOwner${index}`}>
                                <img className='spotImg' src={spot.previewImage} alt="Preview Image" />
                                <div className='spotInfoCon'>
                                    <div className='spotInfo'>
                                        <p className='spotLocation'>{`${spot.city},${spot.state}`}</p>
                                        <p className='spotPrice'><b>${spot.price}</b> night</p>
                                    </div>
                                    <div className='spotRatingsCon'>
                                        <div className='ratingIconCon'>
                                            <FaStar className='ratingIcon'/>
                                        </div>
                                        <p className='spotRating'>{Math.round(spot.avgRating * 10) / 10}</p>
                                    </div>
                                </div>
                                <div className='buttonsCon'>
                                    <button 
                                        className='actionButton' 
                                        onClick={() => navigate(`/spots/${spot.id}/edit`)}

                                    >Update</button>
                                    <OpenModalButton 
                                        modalComponent={<SpotDelete spotId={spot.id}/>} // component to render inside the modal
                                        buttonText={'Delete'} // text of the button that opens the modal
                                    />
                                </div>
                                {/* <div title="regular tooltip">Hover me</div> */}
                            </div>
                    )) : null}
                </div>
            </div>
        </div>
    );
}

export default SpotSearch;