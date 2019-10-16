import api from '../../../apiurl'
import { tokenConfig } from "./../usermanagement/auth";
import {
    MYPROFILE_LOADED,
    MYPROFILE_LOADING,
    AUTH_ERROR
  } from "../../types";
// CHECK TOKEN & LOAD USER
export const loadUserProfile = () => (dispatch, getState) => {
    // User Loading
    dispatch({ type: MYPROFILE_LOADING });
    api.get("/user_profile/", tokenConfig(getState))
    .then(res => {
        dispatch({
            type: MYPROFILE_LOADED,
            payload: res.data[0]
        });
    })
    .catch(err => {
        //message.error(err.response.data.details,10);
        //dispatch(returnErrors(err.response.data, err.response.status));
        dispatch({
            type: AUTH_ERROR
        });
    });
};


// Return current user details - helper function
export const getUserDetails = getState => {
    // Returns dict containing username and role
    let userDetails = {};
    if (getState().myProfile.user){
        userDetails = {username: getState().myProfile.user.username,
            role: getState().myProfile.user.groups.name};
    }
    return userDetails;
  };
  
