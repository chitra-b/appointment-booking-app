import api from "../../../apiurl";
import { tokenConfig } from "../usermanagement/auth";
import { message } from "antd";

import {
  USER_PREFERENCE_UPDATED,
  USER_PREFERENCE_UPDATE_ERROR,
  USER_PREFERENCE_UPDATING
} from "../../types";

export const updateUserPreference = (userid, userdata) => (
  dispatch,
  getState
) => {
  dispatch({ type: USER_PREFERENCE_UPDATING });
  api
    .patch(
      "/user_preferences/"+userid.toString()+"/",
      userdata,
      tokenConfig(getState)
    )
    .then(res => {
      dispatch({
        type: USER_PREFERENCE_UPDATED,
        payload: res.data
      });
      message.success("User prefernece updated successfully");
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
        type: USER_PREFERENCE_UPDATE_ERROR,
        payload: err_msg
      });
    });
};
