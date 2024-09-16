import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import './ReviewDelete.css';
import * as spotActions from '../../../store/spot';
import * as reviewActions from '../../../store/review'
import { useModal } from '../../../context/Modal';

function ReviewDelete({spotId, reviewId}) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    // const [errors, setErrors] = useState({});
    // const spot = useSelector(state => state.spot.spotSolo);

    const handleYes = () => {
        if (spotId) {
            dispatch(reviewActions.deleteReview(reviewId))
            .then(closeModal)
            .then(() => dispatch(reviewActions.fetchReviewsSpot(spotId)));
        } else {
            dispatch(reviewActions.deleteReview(reviewId))
            .then(closeModal)
            .then(() => dispatch(reviewActions.fetchReviewsUser()));
        }
        
    }

    // useEffect(() => {
    //     dispatch(spotActions.fetchSpot(spotId))
    //     dispatch(reviewActions.fetchReviewsSpot(spotId))
    // }, [dispatch]);
  
    return (
        <div className='deleteCon'>
            <h1 className='deleteTitle'>Confirm Delete</h1>
            <p className='deleteText'>Are you sure you want to delete this review?</p>
            {/* <div className='deleteButtonCon'> */}
                <button className='deleteButton yes' onClick={handleYes}>Yes (Delete Review)</button>
                <button className='deleteButton no' onClick={closeModal}>No (Keep Review)</button>
            {/* </div> */}
            
        </div>
    );
}

export default ReviewDelete;