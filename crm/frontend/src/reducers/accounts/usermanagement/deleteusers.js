import {
    USERS_DELETED,
    USERS_DELETING,
    USERS_DELETE_ERROR,
    RESET_USER_STATE
  } from "../../../actions/types";
  
  const initialState = {
    isDeleted: false,
    isDeleting: false,
    isDeleteError: false
  };
  
  export default function(state = initialState, action) {
    switch (action.type) {
      case RESET_USER_STATE:
        return initialState;
      case USERS_DELETED:
        return {
          ...state,
          isDeleted: true,
          isDeleting: false,
          isDeleteError: false
        };
      case USERS_DELETE_ERROR:
        return {
          ...state,
          isDeleted: false,
          isDeleting: false,
          isDeleteError: action.payload
        };
      case USERS_DELETING:
        return {
          ...state,
          isDeleted: false,
          isDeleting: true,
          isDeleteError: false
        };
      default:
        return state;
    }
  }
  