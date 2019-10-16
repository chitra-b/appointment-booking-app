import api from "../../apiurl";
import { tokenConfig } from "../accounts/usermanagement/auth";
import {
    APPOINTMENT_DETAILS_LOADING,
    APPOINTMENT_DETAILS_FETCH_ERROR,
    APPOINTMENT_DETAILS_LOADED
} from "../types";

export const getAppointmentDetails =  (id) => (
  dispatch,
  getState
) => {
  dispatch({ type: APPOINTMENT_DETAILS_LOADING });
   api
    .get(
      "/appointments/"+id.toString()+"/",
      tokenConfig(getState)
    )
    .then(res => {
      dispatch({
        type: APPOINTMENT_DETAILS_LOADED,
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
        type: APPOINTMENT_DETAILS_FETCH_ERROR,
        payload: err_msg
      });
    });
};