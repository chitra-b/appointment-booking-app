import {
  USERLIST_ERROR,
  USERLIST_LOADED,
  USERLIST_LOADING,
  USER_UPDATED_LIST,
  USER_DELETED_LIST
} from "../../../actions/types";

const initialState = {
  isLoading: false,
  isError: false,
  userlist: null,
  count: null
};
let users = [];
export default function(state = initialState, action) {
  switch (action.type) {
    case USERLIST_LOADED:
      return {
        ...state,
        isLoading: false,
        isError: false,
        userlist: action.payload.results,
        count: action.payload.count
      };
    case USER_UPDATED_LIST:
      users = state.userlist;
      if (users) {
        for (var i = 0; i < users.length; i++) {
          if (users[i].id == action.payload.id) {
            users[i] = action.payload;
          }
        }
      }
      return {
        ...state,
        userlist: users
      };
    case USER_DELETED_LIST:
      users = state.userlist;
      if (users) {
        users = users.filter(function(el) {
          return action.payload.indexOf(el.id) < 0;
        });
      }
      return {
        ...state,
        userlist: users
      };
    case USERLIST_ERROR:
      return {
        ...state,
        isError: action.payload,
        isLoading: false,
        userlist: null,
        count: null
      };
    case USERLIST_LOADING:
      return {
        ...state,
        isLoading: true,
        isError: false,
        userlist: null,
        count: null
      };
    default:
      return state;
  }
}
