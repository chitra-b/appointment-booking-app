import {
    APPOINTMENTS_FETCH_ERROR,
    APPOINTMENTS_LOADED,
    APPOINTMENTS_LOADING
  } from "../../actions/types";
  
  const initialState = {
    isLoading: false,
    isError: false,
    appointments: [],
    count: null
  };
  
  export default function(state = initialState, action) {
    switch (action.type) {
      case APPOINTMENTS_LOADED:
        return {
          ...state,
          isLoading: false,
          isError: false,
          appointments: action.payload
        };
      case APPOINTMENTS_FETCH_ERROR:
        return {
          ...state,
          isError: action.payload,
          isLoading: false,
          appointments: null
        };
      case APPOINTMENTS_LOADING:
        return {
          ...state,
          isLoading: true,
          isError: false
        };
      default:
        return state;
    }
  }
  