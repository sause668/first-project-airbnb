import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import './SpotSolo.css';
import * as spotActions from '../../../store/spot';
import * as reviewActions from '../../../store/review'
import OpenModalButton from '../../OpenModalButton/OpenModalButton';
import ReviewEdit from '../../Reviews/ReviewEditModal/ReviewEditModal';
import ReviewDelete from '../../Reviews/ReviewDeleteModal/ReviewDelete';

function SpotSolo() {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const spot = useSelector(state => state.spot.spotSolo);
    const reviews = useSelector(state => state.review.reviewsSpot)

    useEffect(() => {
        dispatch(spotActions.fetchSpot(spotId))
        dispatch(reviewActions.fetchReviewsSpot(spotId))
    }, [dispatch, spotId]);
  
    return (
        <div id='SpotSoloContainer'>
            {(spot) ? (
                <>
                    <div id='spotTitleCon'>
                        <h1>{spot.name}</h1>
                        <h3>{`${spot.city}, ${spot.state}, ${spot.country}`}</h3>
                    </div>
                    <div id='spotImagesCon'>
                        <div id='previewImage'>
                            <img src="" alt="Preview Image"/>
                        </div>
                        <div id='spotImages'>
                            {spot.SpotImages.filter(img => img.preview === false)
                                .map((image, index)  => (
                                    <img src="" alt={image.id} />
                            ))}
                        </div>
                    </div>
                    <div id='spotInfoPriceCon'>
                        <div id='SpotInfoCon'>
                            <h2 id='spotOwner'>{`Hosted by ${spot.Owner.firstName} ${spot.Owner.lastName}`}</h2>
                            <p id='spotDescription'>{`${spot.description}`}</p>
                        </div>
                        <div id='spotPriceReviewsBookingCon'>
                            <div id='spotPriceReviewsCon'>
                                <h5><b>${spot.price}</b> night</h5>
                                <h5>{' startIcon '}{spot.avgRating} {' dotIcon '}{`${spot.numReviews} reviews`} </h5>
                            </div>
                            <button id='spotBooking'>Reserve</button>
                        </div>
                    </div>
                    <div id='spotReviewCon'>
                        <h2>{' startIcon '}{spot.avgRating} {' dotIcon '}{`${spot.numReviews} reviews`} </h2>
                        <OpenModalButton 
                            modalComponent={<ReviewEdit/>} // component to render inside the modal
                            buttonText={'Post Your Review'} // text of the button that opens the modal
                            // onButtonClick, // optional: callback function that will be called once the button that opens the modal is clicked
                            // onModalClose // optional: callback function that will be called once the modal is closed
                        />
                        {(reviews) ? <ul>
                            {reviews.Reviews.map((review, index) => (
                                <li>
                                    <h3>{review.User.firstName}</h3>
                                    <h4>{review.createdAt}</h4>
                                    <p>{review.review}</p>
                                    <OpenModalButton 
                                        modalComponent={<ReviewDelete/>} // component to render inside the modal
                                        buttonText={'Delete'} // text of the button that opens the modal
                                        // onButtonClick, // optional: callback function that will be called once the button that opens the modal is clicked
                                        // onModalClose // optional: callback function that will be called once the modal is closed
                                    />
                                </li>
                            ))}
                        </ul>:null}
                    </div>
                    
                </>
            ) : null}
        </div>
    );
}

export default SpotSolo;