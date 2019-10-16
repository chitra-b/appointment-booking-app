import {
  USERDETAILS_LOADED,
  USERDETAILS_LOADING,
  USERDETAILS_ERROR,
  RESET_USER_STATE
} from "../../../actions/types";

const initialState = {
  isFetching: false,
  isError: false,
  user: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case RESET_USER_STATE:
      return initialState;
    case USERDETAILS_LOADED:
      return {
        ...state,
        isFetching: false,
        isError: false,
        user: action.payload
      };
    case USERDETAILS_ERROR:
      return {
        ...state,
        isError: action.payload,
        isFetching: false,
        user: null
      };
    case USERDETAILS_LOADING:
      return {
        ...state,
        isFetching: true,
        isError: false,
        user: null
      };
    default:
      return state;
  }
}
