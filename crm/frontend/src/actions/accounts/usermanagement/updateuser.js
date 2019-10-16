import api from "../../../apiurl";
import { tokenConfig } from "./../usermanagement/auth";
import { message } from "antd";
import {
  USER_UPDATING,
  USER_UPDATE_ERROR,
  USER_UPDATED,
  USER_UPDATED_LIST
} from "../../types";

export const updateUser = (userid, userdata) => (dispatch, getState) => {
  dispatch({ type: USER_UPDATING });
  const body = JSON.stringify(userdata);
  api
    .patch(
      "/users/" + userid.toString() + "/",
      body,
      tokenConfig(getState)
    )
    .then(res => {
      message.success("User updated successfully");
      dispatch({
        type: USER_UPDATED,
        payload: res.data
      });
      dispatch({ type: USER_UPDATED_LIST, payload: res.data });
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
        type: USER_UPDATE_ERROR,
        payload: err_msg
      });
    });
};