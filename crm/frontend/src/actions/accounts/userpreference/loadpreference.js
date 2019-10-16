import api from "../../../apiurl";
import { tokenConfig } from "../usermanagement/auth";
import {
  USER_PREFERENCE_LOADED,
  USER_PREFERENCE_LOAD_ERROR,
  USER_PREFERENCE_LOADING
} from "../../types";

export const getUserPreference = userid => (dispatch, getState) => {
  dispatch({ type: USER_PREFERENCE_LOADING });
  api
    .get("/user_preferences/", tokenConfig(getState))
    .then(res => {
      dispatch({
        type: USER_PREFERENCE_LOADED,
        payload: res.data[0]
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
        type: USER_PREFERENCE_LOAD_ERROR,
        payload: err_msg
      });
    });
};
