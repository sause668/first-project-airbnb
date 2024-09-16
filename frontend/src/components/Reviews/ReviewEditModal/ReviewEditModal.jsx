import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { IoStarOutline } from "react-icons/io5";
import { IoIosStar } from "react-icons/io";

import './ReviewEdit.css';
import * as reviewActions from '../../../store/review';
import { useModal } from '../../../context/Modal';

function ReviewEdit({spotId, review}) {
    const [reviewText, setReviewText] = useState((review) ? review.review : '');
    const [reviewStars, setReviewStars] = useState(review ? review.stars : 0);
    const [starsInput, setStarsInput] = useState(reviewStars);
    const [isLoaded, setIsLoaded] = useState(false);
    const [errors, setErrors] = useState({});

    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const star = [1, 2, 3, 4, 5];

    if (review && !isLoaded) {
        setReviewText(review.review);
        setReviewStars(review.stars);
        setIsLoaded(true);
    }

    const handleStarEnter = (star) => {
        setStarsInput(star);
    }

    const handleStarLeave = () => {
        setStarsInput(reviewStars);
    }

    const handleStarClick = (star) => {
        setReviewStars(star);
        setStarsInput(star);
    }

    const handleSubmit = () => {
        setErrors({});
        if (review) {
            return dispatch(reviewActions.editReview({
                reviewId: review.id,
                review: reviewText,
                stars: reviewStars
            }))
            .then(closeModal)
            .then(() => dispatch(reviewActions.fetchReviewsUser()))
            .catch(async (res) => {
                const err = await res.json();
                if (err) {
                    if (err.errors) {
                        setErrors(err.errors);
                    } else {
                        if (err.stack) delete err.stack;
                        setErrors(err)
                    }
                }
            }); 
        } else {
            return dispatch(reviewActions.createReview({
                spotId,
                review: reviewText,
                stars: reviewStars
            }))
            .then(closeModal)
            .then(() => dispatch(reviewActions.fetchReviewsSpot(spotId)))
            .catch(async (res) => {
                const err = await res.json();
                if (err) {
                    if (err.errors) {
                        setErrors(err.errors);
                    } else {
                        if (err.stack) delete err.stack;
                        setErrors(err)
                    }
                }
            });

        }
    }


    // useEffect(() => {
    //     if (review && isLoaded(false)) {
    //         setReviewText(review.text);
    //         setReviewStars(review.stars);
    //         setIsLoaded(true);

    //     }
    // }, []);
  
  
    // useEffect(() => {
    //     if (review && isLoaded(false)) {
    //         setReviewText(review.text);
    //         setReviewStars(review.stars);
    //         setIsLoaded(true);

    //     }
    // }, []);
  
    return (
        <div id='reviewEditCon'>
            <h1 id='reviewEditTitle'>{(review) ? `How was your stay at ${review.Spot.name}?`:'How was your stay?'}</h1>
            {errors ? (<>
                {Object.values(errors).map((err, index) => (
                    <p className='error' key={`reviewEditError${index}`}>{err}</p>
                ))}
            </>):null}
            <textarea 
                name="review" 
                id="reviewEditText" 
                placeholder='Leave your review here...' 
                cols="30" rows="10"
                value={reviewText}
                onChange={(e)=>setReviewText(e.target.value)}
            />
            <div id='reviewStarsCon'>
                {star.map((star, index) => (
                    <div 
                        key={`reviewStars${index}`}
                        onMouseEnter={()=>handleStarEnter(star)} 
                        onMouseLeave={()=>handleStarLeave(star)}
                        onClick={()=>handleStarClick(star)}
                    >
                        {star <= starsInput ? (
                            <IoIosStar className='reviewStar' />
                        ): (
                            <IoStarOutline className='reviewStar'
                        />)}
                    </div>
                ))}
            </div>
            
            <button 
                id='reviewSubmit'
                onClick={handleSubmit}
                disabled={!reviewText || !reviewStars}
            >Submit Your Review</button>
        </div>
    );
}

export default ReviewEdit;