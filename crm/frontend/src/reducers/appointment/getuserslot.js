import {
  USER_TIMESLOT_LOADED,
  USER_TIMESLOT_LOAD_ERROR,
  USER_TIMESLOT_LOADING,
  SET_SELECTED_DATE,
  SET_SELECTED_TIME,
  SET_TIMEZONE,
  SET_USER,
  SET_SLOT_DURATION
} from "../../actions/types";

const initialState = {
  isLoading: false,
  isError: false,
  selectedDate: null,
  selectedTime: null,
  timezone: null,
  user: null,
  slot_duration: null,
  user_timeslot: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case USER_TIMESLOT_LOADED:
      return {
        ...state,
        isLoading: false,
        isError: false,
        user_timeslot: action.payload
      };
    case USER_TIMESLOT_LOAD_ERROR:
      return {
        ...state,
        isError: action.payload,
        isLoading: false,
        user_timeslot: null
      };
    case USER_TIMESLOT_LOADING:
      return {
        ...state,
        isLoading: true,
        isError: false,
        user_timeslot: null
      };
    case SET_SELECTED_DATE:
      return {
        ...state,
        selectedDate: action.payload
      };
    case SET_SELECTED_TIME:
      return {
        ...state,
        selectedTime: action.payload
      };
    case SET_TIMEZONE:
      return {
        ...state,
        timezone: action.payload
      };
    case SET_USER:
      return {
        ...state,
        user: action.payload
      };
    case SET_SLOT_DURATION:
      return {
        ...state,
        slot_duration: action.payload
      };
    default:
      return state;
  }
}
