import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../../context/Modal";
import { createBooking, editBooking, fetchSpotBookings, fetchUserBookings } from "../../../store/booking";
import { useEffect } from "react";
import './BookingEditModal.css'
import { formatDate } from "../../../utils/helperFunctions";


function BookingEditModal ({booking, spotId, isBookingPage}) {
    const dispatch = useDispatch();
    const bookings = useSelector(state => state.booking.spotBookings)
    const [startDate, setStartDate] = useState(booking ? booking.startDate:'');
    const [endDate, setEndDate] = useState(booking ? booking.endDate:'');
    const [errors, setErrors] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);
    const { closeModal } = useModal();
  
    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrors({});
        if (booking) {
            return dispatch(editBooking({
                bookingId: booking.id,
                startDate,
                endDate
            }))
            .then(closeModal)
            .then(() => {
                if (isBookingPage) dispatch(fetchUserBookings())
                else dispatch(fetchSpotBookings(booking.spotId))
            })
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
            return dispatch(createBooking({
                spotId,
                startDate,
                endDate
            }))
            .then(closeModal)
            .then(() => {
                if (isBookingPage) dispatch(fetchUserBookings())
                else dispatch(fetchSpotBookings(spotId))
            })
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
    };

    

    useEffect(() => {
        dispatch(fetchSpotBookings(booking ? booking.spotId: spotId))
        .then(() => setIsLoaded(true))
    }, [dispatch, booking, spotId])
  
    return (
      <div className='formCon'>
        <h1 className='inputTitle'>{booking ? 'Edit':'New'} Booking</h1>
        {isLoaded && (
            <div id='currentBookingsCon'>
            <h3 id="currentBookingsTitle" >Current Bookings:</h3>
            {bookings && bookings
            // .filter((currentBooking) => booking && booking.id == currentBooking.id )
            .map((currentBooking, index) => (
                <h4 
                    className="currentBookings" 
                    key={`currentBooking${index}`}
                >{currentBooking.User && `${currentBooking.User.firstName} ${currentBooking.User.lastName}: `}{formatDate(currentBooking.startDate)} - {formatDate(currentBooking.endDate)}</h4>
            ))}
            </div>
        )}
        <form onSubmit={handleSubmit}>
            {/* Start Date */}
            <div className='inputCon'>
                <label htmlFor='startDate'>
                    <p className='labelTitle'>
                        Start Date
                    </p>
                </label>
                <input
                    className='formInput'
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                />
                {errors.startDate && <p className='labelTitle error'>{errors.startDate}</p>}
            </div>
            {/* End Date */}
            <div className='inputCon'>
                <label htmlFor='endDate'>
                    <p className='labelTitle'>
                        End Date
                    </p>
                </label>
                <input
                    className='formInput'
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                />
                {errors.endDate && <p className='labelTitle error'>{errors.endDate}</p>}
            </div>
            <div className="submitCon">
                <button 
                    className='submitButton'
                    type="submit"
                    disabled={(
                        !startDate.length ||
                        !endDate.length 
                    )}
                >Submit</button>
            </div>
            {errors.message && <p className='labelTitle error'>{errors.message}</p>}
        </form>
      </div>
    );
  }

export default BookingEditModal;