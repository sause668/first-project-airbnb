import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import './SpotDelete.css';
import * as spotActions from '../../../store/spot';

function SpotDelete() {
    // const dispatch = useDispatch();
    // const spot = useSelector(state => state.spot.spotSolo);

    // useEffect(() => {
    //     dispatch(spotActions.fetchSpot(spotId))
    //     dispatch(reviewActions.fetchReviewsSpot(spotId))
    // }, [dispatch]);
  
    return (
        <div id='spotDeleteCon'>
            <h1>Confirm Delete</h1>
            <p>Are you sure you want to remove this spot from the listings?</p>
            <button>Yes (Delete Spot)</button>
            <button>No (Keep Spot)</button>
        </div>
    );
}

export default SpotDelete;