import api from "../../apiurl";
import { tokenConfig } from "../accounts/usermanagement/auth";
import { ROLES_LOADING, ROLES_LOADED, ROLES_ERROR, TIME_ZONE_LOADED, TIME_ZONE_LOADING } from "../types";

// GET USER ROLES
export const loadRoles = () => (dispatch, getState) => {
  dispatch({ type: ROLES_LOADING });
  api
    .get("/groups/", tokenConfig(getState))
    .then(res => {
      dispatch({
        type: ROLES_LOADED,
        payload: res.data.results
      });
    })
    .catch(err => {
      dispatch({
        type: ROLES_ERROR
      });
    });
};

export const reset = (RESET) =>{
  return {
    type: RESET
  }
}

// GET Timezone
export const loadTimezones = () => (dispatch, getState) => {
  dispatch({ type: TIME_ZONE_LOADING });
  api
    .get("/timezones/", tokenConfig(getState))
    .then(res => {
      dispatch({
        type: TIME_ZONE_LOADED,
        payload: res.data.data
      });
    });
};
