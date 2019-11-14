import axios from 'axios';

export const FETCH_START = 'FETCH_START';
export const FETCH_SUCCESS = 'FETCH_SUCCESS';
export const FETCH_FAILURE = 'FETCH_FAILURE';

export const fetch = () => dispatch => {
  dispatch({ type: FETCH_START });
  axios
    .get('http://localhost:5000/fetch')
    .then(res => {
      dispatch({ type: FETCH_SUCCESS, payload: res.data });
    })
    .catch(err => {
      dispatch({
        type: FETCH_FAILURE,
        payload: `${err.message}`
      });
    });
};
