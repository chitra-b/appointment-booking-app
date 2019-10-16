import {
    USER_PREFERENCE_UPDATED,
    USER_PREFERENCE_UPDATE_ERROR,
    USER_PREFERENCE_UPDATING
  } from "../../../actions/types";
  
  const initialState = {
    isLoading: false,
    isError: false,
    user_preference: null
  };
  
  export default function(state = initialState, action) {
    switch (action.type) {
      case USER_PREFERENCE_UPDATED:
        return {
          ...state,
          isLoading: false,
          isError: false,
          user_preference: action.payload
        };
      case USER_PREFERENCE_UPDATE_ERROR:
        return {
          ...state,
          isError: action.payload,
          isLoading: false,
          user_preference: null
        };
      case USER_PREFERENCE_UPDATING:
        return {
          ...state,
          isLoading: true,
          isError: false,
          user_preference: null
        };
      default:
        return state;
    }
  }
  