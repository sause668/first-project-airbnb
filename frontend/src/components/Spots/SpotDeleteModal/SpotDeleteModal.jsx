import { useDispatch } from 'react-redux';
import './SpotDelete.css';
import * as spotActions from '../../../store/spot';
import { useModal } from '../../../context/Modal';

function SpotDelete({spotId}) {
    const dispatch = useDispatch();

    const { closeModal } = useModal();

    const handleYes = () => {
        dispatch(spotActions.deleteSpot(spotId))
        .then(closeModal)
        .then(() => dispatch(spotActions.fetchSpotsOwner()));
    }
  
    return (
        <div className='deleteCon'>
            <h1 className='deleteTitle'>Confirm Delete</h1>
            <p className='deleteText'>Are you sure you want to remove this spot from the listings?</p>
            <button className='deleteButton yes' onClick={handleYes}>Yes (Delete Spot)</button>
            <button className='deleteButton no' onClick={closeModal}>No (Keep Spot)</button>
        </div>
    );
}

export default SpotDelete;