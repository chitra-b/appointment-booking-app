import {
  MYPROFILE_UPDATING,
  MYPROFILE_UPDATED,
  MYPROFILE_UPDATE_ERROR
} from "../../../actions/types";

const initialState = {
  isLoading: false,
  isError: false,
  user: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case MYPROFILE_UPDATING:
      return {
        ...state,
        isLoading: true,
        isError:false
      };
    case MYPROFILE_UPDATED:
      return {
        ...state,
        isLoading: false,
        isError:false,
        user: action.payload
      };
    case MYPROFILE_UPDATE_ERROR:
      return {
        ...state,
        isLoading: false,
        isError:action.payload
      };
    default:
      return state;
  }
}
