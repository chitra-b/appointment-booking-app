import api from '../../../apiurl'
import { tokenConfig } from "../usermanagement/auth";
import { message } from 'antd';
import {
    USERS_DELETED,
    USERS_DELETE_ERROR,
    USERS_DELETING,
    USER_DELETED_LIST
  } from "../../types";

  
  export const deleteUsers = (useridList) => (dispatch, getState) => {
    dispatch({ type: USERS_DELETING });
    api
      .delete("/users/delete/", {headers: tokenConfig(getState).headers,
      data:{users:useridList}
      })
      .then(res => {
        message.success('User deleted successfully');
        dispatch({
          type: USERS_DELETED
        });
        dispatch({ type: USER_DELETED_LIST, payload: useridList });
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
          type: USERS_DELETE_ERROR,
          payload: err_msg
        });
      });
  };