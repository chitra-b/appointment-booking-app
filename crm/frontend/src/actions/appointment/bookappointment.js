import api from "../../apiurl";
import {
  BOOK_APPOINTMENT,
  BOOK_APPOINTMENT_ERROR,
  BOOK_APPOINTMENT_SUCCESS
} from "../../actions/types";

export const bookappointment = data => (dispatch, getState) => {
  dispatch({ type: BOOK_APPOINTMENT });
  api
    .post("/appointments/", data)
    .then(res => {
      dispatch({
        type: BOOK_APPOINTMENT_SUCCESS,
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
        type: BOOK_APPOINTMENT_ERROR,
        payload: err_msg
      });
    });
};
