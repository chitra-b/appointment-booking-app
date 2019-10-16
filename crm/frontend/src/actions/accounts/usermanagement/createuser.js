import api from "../../../apiurl";
import { tokenConfig } from "./../usermanagement/auth";
import { REGISTER_SUCCESS, REGISTER_FAIL, REGISTER_LOADING } from "../../types";
import { message } from "antd";

//Create new user

export const createUser = userdata => (dispatch, getState) => {
  dispatch({ type: REGISTER_LOADING });
  const body = JSON.stringify(userdata);
  api
    .post("/users/", body, tokenConfig(getState))
    .then(res => {
      message.success("User created successfully");
      dispatch({
        type: REGISTER_SUCCESS,
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
        type: REGISTER_FAIL,
        payload: err_msg
      });
    });
};
