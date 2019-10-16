import {
  USER_UPDATING,
  USER_UPDATED,
  USER_UPDATE_ERROR,
  RESET_USER_STATE
} from "../../../actions/types";

const initialState = {
  isUpdated: false,
  isUpdating: false,
  isUpdateError: false,
  user: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case RESET_USER_STATE:
      return initialState;
    case USER_UPDATED:
      return {
        ...state,
        isUpdated: true,
        isUpdating: false,
        isUpdateError: false,
        user: action.payload
      };
    case USER_UPDATE_ERROR:
      return {
        ...state,
        isUpdated: false,
        isUpdating: false,
        isUpdateError: action.payload,
        user: null
      };
    case USER_UPDATING:
      return {
        ...state,
        isUpdated: false,
        isUpdating: true,
        isUpdateError: false,
        user: null
      };
    default:
      return state;
  }
}
