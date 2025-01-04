import { useDispatch, useSelector } from "react-redux";
import { fetchUserBookings } from "../../../store/booking";
import BookingEditModal from "../BookingEditModal/BookingEditModal";
import BookingDeleteModal from "../BookingDeleteModal/BookingDeleteModal";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import OpenModalButton from "../../OpenModalButton/OpenModalButton";
import './BookingClientPage.css';
import { formatDate } from "../../../utils/helperFunctions";


function BookingClientPage() {
    const bookings = useSelector(state => state.booking.userBookings)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(state => state.session.user);
    const [isLoaded, setIsLoaded] = useState(false);


    useEffect(() => {
        if (!user) navigate('/');
        else dispatch(fetchUserBookings())
        .then(() => {
            setIsLoaded(true)
        });
    }, [dispatch, navigate, user]);
  
    return (
        <div id='bookingsUserContainer'>
            <h1 id='bookingUserTitle'>Manage Bookings</h1>
            <div id="bookingsCon">
                {(isLoaded) && bookings.Bookings.map((booking, index) => (
                    <div className='bookingUser' key={`bookingUser${index}`}>
                        <img className='bookingImage' src={booking.Spot.previewImage} alt="Preview Image"/>
                        <h3 className="bookingUserName">{booking.Spot.name}</h3>
                        <h4 className='bookingDate'>{formatDate(booking.startDate)} - {formatDate(booking.endDate)}</h4>
                        <div className='bookingButtons'>
                            <OpenModalButton
                                modalComponent={<BookingEditModal booking={booking}/>} // component to render inside the modal
                                buttonText={'Update'} // text of the button that opens the modal
                                // onButtonClick, // optional: callback function that will be called once the button that opens the modal is clicked
                                // onModalClose // optional: callback function that will be called once the modal is closed
                            />
                            <OpenModalButton 
                                modalComponent={<BookingDeleteModal bookingId={booking.id}/>} // component to render inside the modal
                                buttonText={'Delete'} // text of the button that opens the modal
                                // onButtonClick, // optional: callback function that will be called once the button that opens the modal is clicked
                                // onModalClose // optional: callback function that will be called once the modal is closed
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default BookingClientPage;