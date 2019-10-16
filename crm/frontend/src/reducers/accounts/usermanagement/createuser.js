import {
    REGISTER_FAIL,
    REGISTER_SUCCESS,
    REGISTER_LOADING,
    RESET_USER_STATE
  } from "../../../actions/types";
  
  const initialState = {
    isCreated: false,
    isLoading: false,
    isError: false,
    user: null
  };
  
  export default function(state = initialState, action) {
    switch (action.type) {
      case RESET_USER_STATE:
        return initialState
      case REGISTER_SUCCESS:
        return {
          ...state,
          isCreated: false,
          isLoading: false,
          isError: false,
          user: action.payload
        };
      case REGISTER_FAIL:
        return {
          ...state,
          isCreated: false,
          isError: action.payload,
          isLoading: false,
          user: null
        };
      case REGISTER_LOADING:
        return {
          ...state,
          isCreated: false,
          isLoading: true,
          isError: false
        };
      default:
        return state;
    }
  }
  