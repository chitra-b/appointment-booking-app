import api from "../../apiurl";
import { tokenConfig } from "../../actions/accounts/usermanagement/auth";
import {
  USER_TIMESLOT_LOADED,
  USER_TIMESLOT_LOAD_ERROR,
  USER_TIMESLOT_LOADING,
  SET_SELECTED_DATE,
  SET_TIMEZONE,
  SET_USER,
  SET_SLOT_DURATION,
  SET_SELECTED_TIME
} from "../../actions/types";

export const getUserAvailableSlots =  (username, slot_duration, timezone, month='') => (
  dispatch,
  getState
) => {
  if (! month){
    var d = new Date();
    month = d.getFullYear() + '-' + (parseInt(d.getMonth())+1);
  }
  dispatch({ type: USER_TIMESLOT_LOADING });
   api
    .get(
      "/appointment_booking/" +
        username +
        "/?slot_duration="+slot_duration+"&month="+month+"&timezone="+timezone,
      tokenConfig(getState)
    )
    .then(res => {
      dispatch({
        type: USER_TIMESLOT_LOADED,
        payload: res.data.days
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
        type: USER_TIMESLOT_LOAD_ERROR,
        payload: err_msg
      });
    });
};

export const setSelectedDate =  (date) => {
  return{
    type: SET_SELECTED_DATE,
    payload:date
  }
}
export const setTimeZone =  (tz) => {
  return{
    type: SET_TIMEZONE,
    payload:tz
  }
}
export const setUser =  (user) => {
  return{
    type: SET_USER,
    payload:user
  }
}
export const setSlotDuration =  (slotduration) => {
  return{
    type: SET_SLOT_DURATION,
    payload:slotduration
  }
}
export const setSelectedTime =  (time) => {
  return{
    type: SET_SELECTED_TIME,
    payload:time
  }
}