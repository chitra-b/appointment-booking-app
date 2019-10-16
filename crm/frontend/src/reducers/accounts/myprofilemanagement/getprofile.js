import { MYPROFILE_LOADING, MYPROFILE_LOADED } from "../../../actions/types";

const initialState = {
  isLoading: false,
  user: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case MYPROFILE_LOADING:
      return {
        ...state,
        isLoading: true
      };
    case MYPROFILE_LOADED:
      return {
        ...state,
        isLoading: false,
        user: action.payload
      };
    default:
      return state;
  }
}
