import {
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  LOGIN_VALIDATING
} from "../../../actions/types";

const initialState = {
  token: null, //localStorage.getItem("token"),
  isAuthenticated: null,
  isLoading: false,
  isError: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOGIN_VALIDATING:
      return {
        ...state,
        isAuthenticated: false,
        isLoading: true,
        isError: false
      };
    case LOGIN_SUCCESS:
      //localStorage.setItem("token", action.payload.access);
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        token: action.payload.access
      };

    case LOGIN_FAIL:
      localStorage.removeItem("root");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        isError: action.payload
      };
    case AUTH_ERROR:
    case LOGOUT_SUCCESS:
      localStorage.removeItem("root");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        isError: false
      };
    default:
      return state;
  }
}
