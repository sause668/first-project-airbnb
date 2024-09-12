import { csrfFetch } from './csrf';

const RECEIVE_REVIEWS_SPOT = 'review/receiveReviewsSpot'
const RECEIVE_REVIEWS_USER = 'review/receiveReviewUser'
const RECEIVE_REVIEW = 'review/receiveReview'
const REMOVE_REVIEW = 'review/removeReview'

//Actions
const receiveReviewsSpot = (reviews) => {
    return {
        type: RECEIVE_REVIEWS_SPOT,
        reviews
    }
}
const receiveReviewsUser = (reviews) => {
    return {
        type: RECEIVE_REVIEWS_USER,
        reviews
    }
}

const receiveReview = (review) => {
    return {
        type: RECEIVE_REVIEW,
        review
    }
}

const removeReview = () => {
    return {
        type: REMOVE_REVIEW
    }
}

//Thunks
export const fetchReviewsSpot = (spotId) => async (dispatch) => {
    const response = await fetch(`/api/spots/${spotId}/reviews`);
    const data = await response.json();
    dispatch(receiveReviewsSpot(data));
    return response;
}

export const fetchReviewsUser = () => async (dispatch) => {
    const response = await csrfFetch('/api/reviews/current');
    const data = await response.json();
    dispatch(receiveReviewsUser(data));
    return response;
}

export const createReview = (params) => async (dispatch) => {
    const { spotId, review, stars } = params;
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        body: JSON.stringify({review, stars})
    });
    const data = await response.json();
    dispatch(receiveReview(data));
    return response;
}

export const editReview = (params) => async (dispatch) => {
    const { reviewId, review, stars } = params;
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'PUT',
        body: JSON.stringify({review, stars})
    });
    const data = await response.json();
    dispatch(receiveReview(data));
    return response;
}

export const deleteReview = (reviewId) => async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE'
    });
    dispatch(removeReview());
    return response;
}


const initialState = { 
    reviewsSpot: null,
    reviewsUser: null,
    reviewSolo: null
};

//Reducer
const reviewReducer = (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_REVIEWS_SPOT:
        return { ...state, reviewsSpot: action.reviews };
    case RECEIVE_REVIEWS_USER:
        return { ...state, reviewsUser: action.reviews };
case RECEIVE_REVIEW:
        return { ...state, reviewSolo: action.review };
    case REMOVE_REVIEW:
        return { ...state, reviewSolo: null };
    default:
        return state;
  }
};

export default reviewReducer;