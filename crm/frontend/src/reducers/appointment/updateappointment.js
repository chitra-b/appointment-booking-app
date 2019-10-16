import {
    UPDATE_APPOINTMENT,
    UPDATE_APPOINTMENT_ERROR,
    UPDATE_APPOINTMENT_SUCCESS,
    RESET_UPDATE_APPOINTMENT_STATE
  } from "../../actions/types";
  
  const initialState = {
    isLoading: false,
    isError: false,
    isupdated: false,
    appointment: null
  };
  
  export default function(state = initialState, action) {
    switch (action.type) {
      case RESET_UPDATE_APPOINTMENT_STATE:
        return initialState;
      case UPDATE_APPOINTMENT:
        return {
          ...state,
          isLoading: true,
          isError: false,
          isupdated: false,
          appointment: null
        };
      case UPDATE_APPOINTMENT_ERROR:
        return {
          ...state,
          isError: action.payload,
          isLoading: false,
          isupdated: false,
          appointment: null
        };
      case UPDATE_APPOINTMENT_SUCCESS:
        return {
          ...state,
          isLoading: false,
          isError: false,
          isupdated: true,
          appointment: action.payload
        };
      default:
        return state;
    }
  }
  