import { csrfFetch } from './csrf';

const RECEIVE_SPOTS_ALL = 'spot/receiveSpotsAll';
const RECEIVE_SPOTS_OWNER = 'spot/receiveSpotsOwner';
const RECEIVE_SPOT = 'spot/receiveSpot'
const REMOVE_SPOT = 'spot/removeSpot'


//Actions
// const setUser = (user) => {
//   return {
//     type: SET_USER,
//     payload: user
//   };
// };

// const removeUser = () => {
//   return {
//     type: REMOVE_USER
//   };
// };

const receiveSpotsAll = (spots) => {
    return {
        type: RECEIVE_SPOTS_ALL,
        spots
    }
}

const receiveSpotsOwner = (spots) => {
    return {
        type: RECEIVE_SPOTS_OWNER,
        spots
    }
}

const receiveSpot = (spot) => {
    return {
        type: RECEIVE_SPOT,
        spot
    }
}

const removeSpot = () => {
    return {
        type: REMOVE_SPOT
    }
}



//Thunks
export const fetchSpots = () => async (dispatch) => {
    const response = await fetch("/api/spots");
    const data = await response.json();
    dispatch(receiveSpotsAll(data));
    return data;
};

export const fetchSpotsOwner =  () => async (dispatch) => {
    const response = await csrfFetch('/api/spots/current');
    const data = await response.json();
    dispatch(receiveSpotsOwner(data));
    return data;
}

export const fetchSpot =  (spotId) => async (dispatch) => {
    const response = await fetch(`/api/spots/${spotId}`);
    const data = await response.json();
    dispatch(receiveSpot(data));
    return response;
}

export const createSpot =  (params) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots`, {
        method: 'POST',
        body: JSON.stringify(params)
    });
    const data = await response.json();
    dispatch(receiveSpot(data));
    return data;
}

export const editSpot =  (params) => async (dispatch) => {
    const { spotId, address, city, state, country, lat, lng, name, description, price} = params;
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'PUT',
        body: JSON.stringify({address, city, state, country, lat, lng, name, description, price})
    });
    const data = await response.json();
    dispatch(receiveSpot(data));
    return data;
}

export const deleteSpot =  (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'DELETE',
    });
    dispatch(removeSpot());
    return response;
}

export const removeSpotState =  () => async (dispatch) => {
    dispatch(removeSpot());
}






const initialState = { 
    spotsAll: null,
    spotsOwner: null,
    spotSolo: null
};

//Reducer
const spotReducer = (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_SPOTS_ALL:
        return { ...state, spotsAll: action.spots };
    case RECEIVE_SPOTS_OWNER:
        return { ...state, spotsOwner: action.spots };
    case RECEIVE_SPOT:
        return { ...state, spotSolo: action.spot };
    case REMOVE_SPOT:
        return { ...state, spotSolo: null };
    default:
        return state;
  }
};

export default spotReducer;