import api from "../../../apiurl";
import { tokenConfig } from "./../usermanagement/auth";
import {
  USERDETAILS_LOADING,
  USERDETAILS_LOADED,
  USERDETAILS_ERROR,
  USERLIST_ERROR,
  USERLIST_LOADED,
  USERLIST_LOADING,
  USER_LOADED
} from "../../types";


// get user details
export const fetchUser = userid => (dispatch, getState) => {
  dispatch({ type: USERDETAILS_LOADING });
  api
    .get("/users/" + userid.toString() + "/", tokenConfig(getState))
    .then(res => {
      dispatch({
        type: USERDETAILS_LOADED,
        payload: res.data
      });
    })
    .catch(err => {
      let err_msg = "";
      if ("detail" in err.response.data) {
        err_msg = err.response.data.detail;
      } else {
        for (var key in err.response.data) {
          err_msg += err.response.data[key];
        }
      }
      dispatch({
        type: USERDETAILS_ERROR,
        payload: err_msg
      });
    });
};

// fetchallusers
export const getUsers = (pagenumber = "") => (dispatch, getState) => {
  let pageUrl = pagenumber
    ? "/users/?page=" + pagenumber.toString()
    : "/users/";
  dispatch({ type: USERLIST_LOADING });
  api
    .get(pageUrl, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: USERLIST_LOADED,
        payload: res.data
      });
    })
    .catch(err => {
      let err_msg = "";
      if ("detail" in err.response.data) {
        err_msg = err.response.data.detail;
      } else {
        for (var key in err.response.data) {
          err_msg += err.response.data[key];
        }
      }
      dispatch({
        type: USERLIST_ERROR,
        payload: err_msg
      });
    });
};
