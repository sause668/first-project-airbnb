import { useDispatch } from 'react-redux';
import './BookingDeleteModal.css';
import { useModal } from '../../../context/Modal';
import { deleteBooking, fetchSpotBookings, fetchUserBookings } from '../../../store/booking';

function BookingDeleteModal({bookingId, spotId}) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleYes = () => {
        dispatch(deleteBooking(bookingId))
        .then(closeModal)
        .then(() => {
            if (spotId) dispatch(fetchSpotBookings(spotId));
            else dispatch(fetchUserBookings());
        })
        
    }
  
    return (
        <div className='deleteCon'>
            <h1 className='deleteTitle'>Confirm Delete</h1>
            <p className='deleteText'>Are you sure you want to delete this booking?</p>
            {/* <div className='deleteButtonCon'> */}
                <button className='deleteButton yes' onClick={handleYes}>Yes (Delete Booking)</button>
                <button className='deleteButton no' onClick={closeModal}>No (Keep Booking)</button>
            {/* </div> */}
            
        </div>
    );
}

export default BookingDeleteModal;