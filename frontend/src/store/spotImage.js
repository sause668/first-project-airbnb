import { csrfFetch } from './csrf';

const RECEIVE_SPOT_IMAGE = 'review/receiveSpotImage'
const REMOVE_SPOT_IMAGE = 'review/removeSpotImage'

//Actions
const receiveSpotImage = (spotImage) => {
    return {
        type: RECEIVE_SPOT_IMAGE,
        spotImage
    }
}

const removeSpotImage = () => {
    return {
        type: REMOVE_SPOT_IMAGE
    }
}

//Thunks

export const createSpotImage = (params) => async (dispatch) => {
    const { spotId, url, preview } = params;
    const response = await csrfFetch(`/api/spots/${spotId}/images`, {
        method: 'POST',
        body: JSON.stringify({url, preview})
    });
    const data = await response.json();
    dispatch(receiveSpotImage(data));
    return response;
}

export const deleteSpotImage = (imageId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spot-images/${imageId}`, {
        method: 'DELETE'
    });
    dispatch(removeSpotImage());
    return response;
}


const initialState = { spotImage: null };

//Reducer
const spotImageReducer = (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_SPOT_IMAGE:
        return { ...state, spotImage: action.spotImage };
    case REMOVE_SPOT_IMAGE:
        return { ...state, spotImage: null };
    default:
        return state;
  }
};

export default spotImageReducer;