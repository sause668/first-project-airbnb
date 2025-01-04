import { csrfFetch } from './csrf';

const RECEIVE_SPOT_BOOKINGS = 'spot/receiveSpotBookings';
const RECEIVE_USER_BOOKINGS = 'spot/receiveUserBookings';
const RECEIVE_BOOKING = 'spot/receiveBooking'
const REMOVE_BOOKING = 'spot/removeBooking'

const receiveSpotBookings = (bookings) => {
    return {
        type: RECEIVE_SPOT_BOOKINGS,
        bookings
    }
}

const receiveUserBookings = (bookings) => {
    return {
        type: RECEIVE_USER_BOOKINGS,
        bookings
    }
}

const receiveBooking = (booking) => {
    return {
        type: RECEIVE_BOOKING,
        booking
    }
}

const removeBooking = () => {
    return {
        type: REMOVE_BOOKING
    }
}


export const fetchUserBookings =  () => async (dispatch) => {
    const response = await csrfFetch("/api/bookings/current");
    const data = await response.json();
    dispatch(receiveUserBookings(data));
    return data;
}

export const fetchSpotBookings = (spotId) => async (dispatch) => {
    const response = await fetch(`/api/spots/${spotId}/bookings`);
    const data = await response.json();
    dispatch(receiveSpotBookings(data));
    console.log()
    return data;
};

export const createBooking =  (params) => async (dispatch) => {
    const { spotId, startDate, endDate } = params;
    const response = await csrfFetch(`/api/spots/${spotId}/bookings`, {
        method: 'POST',
        body: JSON.stringify({startDate, endDate})
    });
    const data = await response.json();
    dispatch(receiveBooking(data));
    return data;
}

export const editBooking =  (params) => async (dispatch) => {
    const { bookingId, startDate, endDate } = params;
    const response = await csrfFetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        body: JSON.stringify({startDate, endDate})
    });
    const data = await response.json();
    dispatch(receiveBooking(data));
    return data;
}

export const deleteBooking =  (bookingId) => async (dispatch) => {
    const response = await csrfFetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
    });
    dispatch(removeBooking());
    return response;
}


const initialState = { 
    spotBookings: null,
    userBookings: null,
    booking: null
};

//Reducer
const bookingReducer = (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_SPOT_BOOKINGS:
        console.log('bah2', action.bookings)
        return { ...state, spotBookings: action.bookings };
    case RECEIVE_USER_BOOKINGS:
        return { ...state, userBookings: action.bookings };
    case RECEIVE_BOOKING:
        return { ...state, booking: action.booking };
    case REMOVE_BOOKING:
        return { ...state, booking: null };
    default:
        return state;
  }
};

export default bookingReducer;