import api from "../../../apiurl";
import { tokenConfig } from "./../usermanagement/auth";
import { message } from "antd";
import {
  MYPROFILE_UPDATED,
  MYPROFILE_UPDATE_ERROR,
  MYPROFILE_UPDATING,
  USER_UPDATED_LIST
} from "../../types";

export const updateProfile = (userid, userdata) => (dispatch, getState) => {
    dispatch({ type: MYPROFILE_UPDATING });
    const body = JSON.stringify(userdata);
    api
      .patch(
        "/user_profile/" + userid.toString() + "/",
        body,
        tokenConfig(getState)
      )
      .then(res => {
        message.success("User updated successfully");
        dispatch({
          type: MYPROFILE_UPDATED,
          payload: res.data
        });
        // update userlist in getUsers state, so it reflects in user list page for
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
          type: MYPROFILE_UPDATE_ERROR,
          payload: err_msg
        });
      });
  };