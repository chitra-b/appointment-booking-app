import api from "../../apiurl";
import { tokenConfig } from "../accounts/usermanagement/auth";
import { getAppointmentDetails } from "./getappointmentdetails"
import {
  UPDATE_APPOINTMENT,
  UPDATE_APPOINTMENT_ERROR,
  UPDATE_APPOINTMENT_SUCCESS
} from "../../actions/types";

export const updateappointment = (id, data) => (dispatch, getState) => {
  dispatch({ type: UPDATE_APPOINTMENT });
  api
    .patch("/appointments/"+id.toString()+"/", data, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: UPDATE_APPOINTMENT_SUCCESS,
        payload: res.data
      });
      dispatch(getAppointmentDetails(id));
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
        type: UPDATE_APPOINTMENT_ERROR,
        payload: err_msg
      });
    });
};
