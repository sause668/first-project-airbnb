import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import './ReviewDelete.css';
import * as spotActions from '../../../store/spot';

function ReviewDelete() {
    // const dispatch = useDispatch();
    // const spot = useSelector(state => state.spot.spotSolo);

    // useEffect(() => {
    //     dispatch(spotActions.fetchSpot(spotId))
    //     dispatch(reviewActions.fetchReviewsSpot(spotId))
    // }, [dispatch]);
  
    return (
        <div id='reviewDeleteCon'>
            <h1>Confirm Delete</h1>
            <p>Are you sure you want to delete this review?</p>
            <button>Yes (Delete Review)</button>
            <button>No (Keep Review)</button>
        </div>
    );
}

export default ReviewDelete;