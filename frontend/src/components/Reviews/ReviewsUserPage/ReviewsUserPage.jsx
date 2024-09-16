import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import './ReviewsUser.css';
import * as reviewActions from '../../../store/review';
import OpenModalButton from '../../OpenModalButton/OpenModalButton';
import ReviewDelete from '../ReviewDeleteModal/ReviewDelete';
import ReviewEdit from '../ReviewEditModal/ReviewEditModal';

function ReviewsUser() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const reviewsUser = useSelector(state => state.review.reviewsUser);
    const user = useSelector(state => state.session.user);
    const [isLoaded, setIsLoaded] = useState(false);

    const convertDate = (date) => {
        let month = date.slice(5,7);
        const year = date.slice(0,4);
        switch (month) {
            case '01':
                month = 'January';
                break;
            case '02':
                month = 'February';
                break;
            case '03':
                month = 'March';
                break;
            case '04':
                month = 'April';
                break;
            case '05':
                month = 'May';
                break;
            case '06':
                month = 'June';
                break;
            case '07':
                month = 'July';
                break;
            case '08':
                month = 'August';
                break;
            case '09':
                month = 'September';
                break;
            case '10':
                month = 'October';
                break;
            case '11':
                month = 'November';
                break;
            case '12':
                month = 'December';
                break;
            
            default:
                break;
        }
        return `${month}, ${year}`;
    }

    useEffect(() => {
        if (!user) navigate('/');
        else dispatch(reviewActions.fetchReviewsUser())
        .then(() => setIsLoaded(true));
    }, [dispatch, navigate, user]);
  
    return (
        <div id='reviewsUserContainer'>
            <h1 id='reviewUserTitle'>Manage Reviews</h1>
            <div>
                {(isLoaded) ? reviewsUser.Reviews.map((review, index) => (
                    <div className='reviewUser' key={`reviewUser${index}`}>
                        <h3 className='reviewUserName'>{review.Spot.name}</h3>
                        <h4 className='reviewUserDate'>{convertDate(review.createdAt)}</h4>
                        <p className='reviewUserText'>{review.review}</p>
                        <div className='reviewButtons'>
                            <OpenModalButton 
                                modalComponent={<ReviewEdit review={review}/>} // component to render inside the modal
                                buttonText={'Update'} // text of the button that opens the modal
                                // onButtonClick, // optional: callback function that will be called once the button that opens the modal is clicked
                                // onModalClose // optional: callback function that will be called once the modal is closed
                            />
                            <OpenModalButton 
                                modalComponent={<ReviewDelete reviewId={review.id}/>} // component to render inside the modal
                                buttonText={'Delete'} // text of the button that opens the modal
                                // onButtonClick, // optional: callback function that will be called once the button that opens the modal is clicked
                                // onModalClose // optional: callback function that will be called once the modal is closed
                            />
                        </div>
                        
                        
                    </div>
                )) : null}
            </div>
        </div>
    );
}

export default ReviewsUser;