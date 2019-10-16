import {
    APPOINTMENT_DETAILS_LOADING,
    APPOINTMENT_DETAILS_FETCH_ERROR,
    APPOINTMENT_DETAILS_LOADED
  } from "../../actions/types";
  
  const initialState = {
    isLoading: false,
    isError: false,
    appointment: null
  };
  
  export default function(state = initialState, action) {
    switch (action.type) {
      case APPOINTMENT_DETAILS_LOADED:
        return {
          ...state,
          isLoading: false,
          isError: false,
          appointment: action.payload
        };
      case APPOINTMENT_DETAILS_FETCH_ERROR:
        return {
          ...state,
          isError: action.payload,
          isLoading: false,
          appointment: null
        };
      case APPOINTMENT_DETAILS_LOADING:
        return {
          ...state,
          isLoading: true,
          isError: false
        };
      default:
        return state;
    }
  }
  