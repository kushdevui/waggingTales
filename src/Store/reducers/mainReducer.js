import { combineReducers } from "redux";
import { LOGOUT_SUCCESS } from "../actions/authAction";
import { userLoginReducer } from "./authReducer";


const allReducers = combineReducers({
  user: userLoginReducer,
});

const rootReducer = (state, action) => {
  if (action.type === LOGOUT_SUCCESS) {
    state = undefined;
  }
  return allReducers(state, action);
};
export default rootReducer;
