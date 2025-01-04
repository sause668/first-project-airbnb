import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { FaStar } from "react-icons/fa";
import { LuDot } from "react-icons/lu";
import './SpotSolo.css';
import * as spotActions from '../../../store/spot';
import * as reviewActions from '../../../store/review'
import OpenModalButton from '../../OpenModalButton/OpenModalButton';
import ReviewEdit from '../../Reviews/ReviewEditModal/ReviewEditModal';
import ReviewDelete from '../../Reviews/ReviewDeleteModal/ReviewDelete';
import BookingEditModal from '../../Bookings/BookingEditModal/BookingEditModal';
import { convertDate } from '../../../utils/helperFunctions';

function SpotSolo() {
    const { spotId } = useParams();
    const [isLoaded, setIsLoaded] = useState(false);
    const dispatch = useDispatch();
    const spot = useSelector(state => state.spot.spotSolo);
    const reviews = useSelector(state => state.review.reviewsSpot);
    const user = useSelector(state => state.session.user);

    useEffect(() => {
        dispatch(spotActions.fetchSpot(spotId))
        .then(() => dispatch(reviewActions.fetchReviewsSpot(spotId)))
        .then(() => setIsLoaded(true))
    }, [dispatch, spotId]);
  
    return (
        <div id='spotSoloMainCon'>
            {(isLoaded) ? (
                <>
                    <div id='spotSoloTitleCon'>
                        <h1 id='spotSoloTitle'>{spot.name}</h1>
                        <h3 id='spotSoloLocation'>{`${spot.city}, ${spot.state}, ${spot.country}`}</h3>
                    </div>
                    <div id='spotSoloImagesCon'>
                        {/* <div > */}
                            <img id='previewImage' src={spot.SpotImages.filter(img => img.preview === true)[0].url} alt="Preview Image"/>
                        {/* </div> */}
                        <div id='spotImagesCon'>
                            {spot.SpotImages.filter(img => img.preview === false)
                                .map((image, index)  => (
                                    <img className='spotImage' key={`spotSoloImage${index}`} src={image.url} alt={image.id} />
                            ))}
                        </div>
                    </div>
                    <div id='spotInfoPriceCon'>
                        <div id='spotInfoCon'>
                            <h1 id='spotOwner'>{`Hosted by ${spot.Owner.firstName} ${spot.Owner.lastName}`}</h1>
                            <p id='spotDescription'>{`${spot.description}`}</p>
                        </div>
                        <div id='spotPriceReviewBookingCon'>
                            <div id='spotPriceReviewsCon'>
                                <div id='priceCon'>
                                    <p id='priceNumber'>${spot.price}</p>
                                    <p id='price'>night</p>
                                </div>
                                {spot.numReviews > 0 ? (
                                    <div id='spotReviewsCon'>
                                        <FaStar id='ratingIcon'/>
                                        <p id='rating'>{Math.round(spot.avgRating * 10) / 10}</p>
                                        <LuDot id='dotIcon' />
                                        <p id='numReviews'>{`${spot.numReviews} ${spot.numReviews === 1 ? 'review':'reviews'}`}</p>
                                    </div>
                                ):(
                                    <div id='spotReviewsCon'>
                                        <FaStar id='ratingIcon'/>
                                        <p id='numReviews'>New</p>
                                    </div>
                                )}
                            </div>
                            {/* <button id='spotBooking'>Reserve</button> */}
                            <OpenModalButton 
                                modalComponent={<BookingEditModal 
                                    spotId={spot.id}
                                    isBookingPage={true}
                                />} // component to render inside the modal
                                buttonText={'Reserve'} // text of the button that opens the modal
                                id={'spotBooking'}
                            />
                        </div>
                    </div>
                    <div id='spotReviewsConBelow'>
                        {spot.numReviews > 0 ? (
                            <div id='spotReviewsCon2'>
                                <FaStar id='ratingIcon2'/>
                                <p id='rating2'>{Math.round(spot.avgRating * 10) / 10}</p>
                                <LuDot id='dotIcon2' />
                                <p id='numReviews2'>{`${spot.numReviews} ${spot.numReviews === 1 ? 'review':'reviews'}`}</p>
                            </div>
                        ):(
                            <div id='spotReviewsCon2'>
                                <FaStar id='ratingIcon2'/>
                                <p id='numReviews2'>New</p>
                            </div>
                        )}
                        <OpenModalButton 
                            modalComponent={<ReviewEdit spotId={spot.id}/>} // component to render inside the modal
                            buttonText={'Post Your Review'} // text of the button that opens the modal
                            // onButtonClick, // optional: callback function that will be called once the button that opens the modal is clicked
                            // onModalClose // optional: callback function that will be called once the modal is closed
                        />
                        {(reviews) ? <>
                            {spot.numReviews > 0 ? (
                                <div id='reviewsListCon'>
                                    {reviews.Reviews.map((review, index) => (
                                        <div className='reviewDetailsCon' key={`reviewDetailsCon${index}`}>
                                            <h3 className='reviewUsers'>{review.User.firstName}</h3>
                                            <h4 className='reviewDates'>{convertDate(review.createdAt)}</h4>
                                            <p className='reviewDetail'>{review.review}</p>
                                            {user && user.id === review.userId ? (
                                                <div className='reviewDelete'>
                                                    <OpenModalButton 
                                                        modalComponent={<ReviewDelete spotId={spotId} reviewId={review.id}/>} // component to render inside the modal
                                                        buttonText={'Delete'} // text of the button that opens the modal
                                                    />
                                                </div>
                                                
                                            ):null}
                                        </div>
                                    ))}
                                </div>
                            ):(
                                <p>Be the first to post a review!</p>
                            )}
                        </>:null}
                    </div>
                    
                </>
            ) : null}
        </div>
    );
}

export default SpotSolo;