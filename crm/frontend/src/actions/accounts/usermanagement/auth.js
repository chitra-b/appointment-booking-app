import api from "../../../apiurl";
import {
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  LOGIN_VALIDATING,
  REGISTER_SUCCESS,
  REGISTER_FAIL
} from "../../types";

// LOGIN USER
export const login = (username, password) => dispatch => {
  // Headers
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  // Request Body
  const body = JSON.stringify({ username, password });
  dispatch({ type: LOGIN_VALIDATING });

  api
    .post("/login/", body, config)
    .then(res => {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data
      });
    })
    .catch(err => {
      //message.error(err.response.data.detail,10);
      //dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: LOGIN_FAIL,
        payload: err.response.data.detail
      });
    });
};

// LOGOUT USER
export const logout = () => (dispatch, getState) => {
  api
    .post("/logout/", null, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: LOGOUT_SUCCESS
      });
      window.location.href = "/login";
    })
    .catch(err => {
      dispatch({
        type: AUTH_ERROR
      });
    });
};

// Setup config with token - helper function
export const tokenConfig = getState => {
  // Get token from state
  const token = getState().auth.token;

  // Headers
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  // If token, add to headers config
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
};
