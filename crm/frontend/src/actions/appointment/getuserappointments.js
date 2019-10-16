import api from "../../apiurl";
import { tokenConfig } from "../accounts/usermanagement/auth";
import {
  APPOINTMENTS_FETCH_ERROR,
  APPOINTMENTS_LOADED,
  APPOINTMENTS_LOADING,
  DATE_FORMAT,
  YEAR_MONTH_FORMAT
} from "../types";
import moment from "moment";
import axios from 'axios';
var CancelToken = axios.CancelToken;
let cancel;
let apiUrl;


export const getUserAppointments =  (
  start_time='', end_time='', team_appointments=false, userDetails=[]) => (
  dispatch,
  getState
) => {
  dispatch({ type: APPOINTMENTS_LOADING });
  cancel && cancel();
  if (userDetails && userDetails.role === 'Admin' && team_appointments === true)
  {
    apiUrl = "/appointments/"+
    "?start_time_after="+start_time+"&end_time_before="+end_time;
  }
  else {
    apiUrl = "/appointments/?user=" + userDetails.username +
    "&start_time_after="+start_time+"&end_time_before="+end_time;
  }
   api
    .get(apiUrl,
      tokenConfig(getState),
      { cancelToken: new CancelToken(function executor(c) {
        // An executor function receives a cancel function as a parameter
        cancel = c;
      })
    }
    )
    .then(res => {
      dispatch({
        type: APPOINTMENTS_LOADED,
        payload: res.data.results
      });
    })
    .catch(err => {
      let err_msg = "";
      if (axios.isCancel(err)){
        console.log("Previous Request Cancelled")
      }
      console.log(err.response);
      if (err.response.data !== 'object'){
        err_msg = "Something went wrong";
      }
      else if ("detail" in err.response.data) {
        err_msg = err.response.data.detail;
      } 
      else {
        for (var key in err.response.data) {
          err_msg += err.response.data[key];
        }
      }
      dispatch({
        type: APPOINTMENTS_FETCH_ERROR,
        payload: err_msg
      });
    });
};