import { csrfFetch } from './csrf';

const RECEIVE_REVIEW_IMAGE = 'review/receiveReviewImage'
const REMOVE_REVIEW_IMAGE = 'review/removeReviewImage'

//Actions
const receiveReviewImage = (reviewImage) => {
    return {
        type: RECEIVE_REVIEW_IMAGE,
        reviewImage
    }
}

const removeReviewImage = () => {
    return {
        type: REMOVE_REVIEW_IMAGE
    }
}

//Thunks
export const createReviewImage = (params) => async (dispatch) => {
    const { reviewId, url} = params;
    const response = await csrfFetch(`/api/reviews/${reviewId}/images`, {
        method: 'POST',
        body: JSON.stringify({url})
    });
    const data = await response.json();
    dispatch(receiveReviewImage(data));
    return response;
}

export const deleteReviewImage = (imageId) => async (dispatch) => {
    const response = await csrfFetch(`/api/review-images/${imageId}`, {
        method: 'DELETE'
    });
    dispatch(removeReviewImage());
    return response;
}


const initialState = { reviewImage: null };

//Reducer
const reviewImageReducer = (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_REVIEW_IMAGE:
        return { ...state, reviewImage: action.reviewImage };
    case REMOVE_REVIEW_IMAGE:
        return { ...state, reviewImage: null };
    default:
        return state;
  }
};

export default reviewImageReducer;