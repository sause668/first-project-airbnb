import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import './ReviewEdit.css';
import * as spotActions from '../../../store/spot';

function ReviewEdit({isNew, review}) {
    const [reviewText, setReviewText] = useState((review) ? review.review: '');
    // const [reviewText, setReviewText] = useState(review.toString());
    const [reviewStars, setReviewStars] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);

    if (review && !isLoaded) {
        setReviewText(review.review);
        setReviewStars(review.stars);
        setIsLoaded(true);

    }

    // useEffect(() => {
    //     if (review && isLoaded(false)) {
    //         setReviewText(review.text);
    //         setReviewStars(review.stars);
    //         setIsLoaded(true);

    //     }
    // }, []);
  
    return (
        <div id='reviewEditCon'>
            <h1>{(review) ? `How was your stay at ${review.Spot.name}?`:'How was your stay?'}</h1>
            <p className='error' style={{
                visibility: (1 && !review)? 'visible':'hidden'
            }}>Review already exists for this spot
            </p>
            <textarea 
                name="review" 
                id="review" 
                placeholder='Leave your review here...' 
                cols="30" rows="10"
                value={reviewText}
            />
            <p>Stars</p>
            <button>Submit Your Review</button>
        </div>
    );
}

export default ReviewEdit;