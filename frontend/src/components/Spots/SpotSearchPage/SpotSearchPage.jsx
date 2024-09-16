import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaStar } from "react-icons/fa";
import './SpotSearch.css';
import * as spotActions from '../../../store/spot';

function SpotSearch() {
    const dispatch = useDispatch();
    const spotsAll = useSelector(state => state.spot.spotsAll);
    const navigate = useNavigate();
    const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(spotActions.fetchSpots())
    .then(() => setIsLoaded(true));
  }, [dispatch]);
  
    return (
        <div id='spotsCon'>
            <div id='spotsGrid' className='curser'>
                {(isLoaded) ? spotsAll.Spots.map((spot, index) => (
                        <div className='spotCard' key={`searchSpots${index}`} onClick={() => navigate(`spots/${spot.id}`)}>
                            <img className='spotImage' src={spot.previewImage} alt="Preview Image" />
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
                            {/* <div title="regular tooltip">Hover me</div> */}
                        </div>
                )) : null}
            </div>
        </div>
    );
}

export default SpotSearch;