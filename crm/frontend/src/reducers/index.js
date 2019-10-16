import { combineReducers } from "redux";
import auth from "./accounts/usermanagement/auth";
import myProfile from "./accounts/myprofilemanagement/getprofile";
import myProfileUpdate from "./accounts/myprofilemanagement/updateprofile";
import createUser from "./accounts/usermanagement/createuser";
import updateUser from "./accounts/usermanagement/updateuser";
import fetchUser from "./accounts/usermanagement/fetchuser";
import getUsers from "./accounts/usermanagement/getusers";
import deleteUsers from "./accounts/usermanagement/deleteusers";
import loadUserPref from "./accounts/userpreference/loadpreference";
import updateUserPref from "./accounts/userpreference/updatepreference";
import getUserSlots from "./appointment/getuserslot";
import bookAppointment from "./appointment/bookappointment";
import userAppointments from "./appointment/getuserappointments";
import appointmentDetails from "./appointment/getappointmentdetails";
import updateAppointment from "./appointment/updateappointment";
import common from "./common";

export default combineReducers({
  auth,
  myProfile,
  myProfileUpdate,
  common,
  createUser,
  updateUser,
  fetchUser,
  getUsers,
  deleteUsers,
  loadUserPref,
  updateUserPref,
  getUserSlots,
  bookAppointment,
  userAppointments,
  appointmentDetails,
  updateAppointment

});
