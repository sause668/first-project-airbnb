import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import './ReviewsUser.css';
import * as reviewActions from '../../../store/review';
import OpenModalButton from '../../OpenModalButton/OpenModalButton';
import ReviewDelete from '../ReviewDeleteModal/ReviewDelete';
import ReviewEdit from '../ReviewEditModal/ReviewEditModal';

function ReviewsUser() {
    const dispatch = useDispatch();
    const reviewsUser = useSelector(state => state.review.reviewsUser);

    useEffect(() => {
        dispatch(reviewActions.fetchReviewsUser())
    }, [dispatch]);
  
    return (
        <div id='ReviewsUserContainer'>
            <h1>Manage Reviews</h1>
            <ul>
                {(reviewsUser) ? reviewsUser.Reviews.map((review, index) => (
                    <li key={`reviewUser${index}`}>
                        <h3>{review.Spot.name}</h3>
                        <h5>{review.createdAt}</h5>
                        <p>{review.review}</p>
                        <OpenModalButton 
                            modalComponent={<ReviewEdit isNew={false} review={review}/>} // component to render inside the modal
                            buttonText={'Update'} // text of the button that opens the modal
                            // onButtonClick, // optional: callback function that will be called once the button that opens the modal is clicked
                            // onModalClose // optional: callback function that will be called once the modal is closed
                        />
                        <OpenModalButton 
                            modalComponent={<ReviewDelete/>} // component to render inside the modal
                            buttonText={'Delete'} // text of the button that opens the modal
                            // onButtonClick, // optional: callback function that will be called once the button that opens the modal is clicked
                            // onModalClose // optional: callback function that will be called once the modal is closed
                        />
                    </li>
                )) : null}
            </ul>
        </div>
    );
}

export default ReviewsUser;