import {
  ROLES_LOADING,
  ROLES_LOADED,
  ROLES_ERROR,
  TIME_ZONE_LOADED,
  TIME_ZONE_LOADING
} from "../../actions/types";

const initialState = {
  roles: null,
  organisation: null,
  isRolesLoading: false,
  isRoleError: false,
  isOrgLoading: false,
  isOrgError: false,
  timeZone: null,
  isTimeZoneLoading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case ROLES_LOADING:
      return {
        ...state,
        isRolesLoading: true,
        isRoleError: false
      };
    case ROLES_LOADED:
      return {
        ...state,
        isRolesLoading: false,
        roles: action.payload
      };
    case ROLES_ERROR:
      return {
        ...state,
        isRoleError: true,
        isRolesLoading: false
      };
    case TIME_ZONE_LOADING:
      return {
        ...state,
        isTimeZoneLoading: true,
        timeZone: false
      };
    case TIME_ZONE_LOADED:
      return {
        ...state,
        isTimeZoneLoading: false,
        timeZone: action.payload
      };
    default:
      return state;
  }
}
