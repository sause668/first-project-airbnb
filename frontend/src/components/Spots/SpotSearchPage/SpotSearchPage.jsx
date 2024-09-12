import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import './SpotSearch.css';
import * as spotActions from '../../../store/spot';

function SpotSearch() {
    const dispatch = useDispatch();
    const spotsAll = useSelector(state => state.spot.spotsAll);
    const navigate = useNavigate();
  
    // dispatch(spotActions.fetchSpots())
//   const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(spotActions.fetchSpots())
  }, [dispatch]);
  
    return (
        <div id='spotSearchContainer'>
            <h1>Spots</h1>
            <ul>
                {(spotsAll) ? spotsAll.Spots.map((spot, index) => (
                    <li key={`searchSpots${index}`} onClick={() => navigate(`spots/${spot.id}`)}>
                        <div className='spotsCard'>
                            <img className='spotsCardImg' src="" alt="Preview Image" />
                            <div className='spotsCardInfo'>
                                <h5>{`${spot.city},${spot.state}`}</h5>
                                <h5>{/*startIcon*/}{spot.avgRating}</h5>
                                <h5><b>${spot.price}</b> night</h5>

                            </div>
                        </div>
                    </li>
                )) : null}
            </ul>
        </div>
    );
}

export default SpotSearch;