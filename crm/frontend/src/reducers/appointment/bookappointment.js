import {
  BOOK_APPOINTMENT,
  BOOK_APPOINTMENT_ERROR,
  BOOK_APPOINTMENT_SUCCESS,
  RESET_BOOKING_STATE
} from "../../actions/types";

const initialState = {
  isLoading: false,
  isError: false,
  isBooked: false,
  appointment: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case RESET_BOOKING_STATE:
      return initialState;
    case BOOK_APPOINTMENT:
      return {
        ...state,
        isLoading: true,
        isError: false,
        isBooked: false,
        appointment: null
      };
    case BOOK_APPOINTMENT_ERROR:
      return {
        ...state,
        isError: action.payload,
        isLoading: false,
        isBooked: false,
        appointment: null
      };
    case BOOK_APPOINTMENT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isError: false,
        isBooked: true,
        appointment: action.payload
      };
    default:
      return state;
  }
}
