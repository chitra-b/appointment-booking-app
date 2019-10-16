import {
  USER_PREFERENCE_LOADED,
  USER_PREFERENCE_LOAD_ERROR,
  USER_PREFERENCE_LOADING
} from "../../../actions/types";

const initialState = {
  isLoading: false,
  isError: false,
  user_preference: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case USER_PREFERENCE_LOADED:
      return {
        ...state,
        isLoading: false,
        isError: false,
        user_preference: action.payload
      };
    case USER_PREFERENCE_LOAD_ERROR:
      return {
        ...state,
        isError: action.payload,
        isLoading: false,
        user_preference: null
      };
    case USER_PREFERENCE_LOADING:
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
