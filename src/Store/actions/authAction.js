import {
  logout,
  setUserToken,
} from "../../Controller/localStorageHandler";
import { routes } from "../../Controller/Routes";
import { history } from "../../Controller/history";

export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";

export function userLoginAction(data) {
 // console.log("data", data);
  setUserToken(data.token);
  //history.push(routes.dashboard.self);
  return{
        type: LOGIN_SUCCESS,
        payload: data,
  };
}

export const setMobileNumber = (mobileNumber) => ({
  type: 'SET_MOBILE_NUMBER',
  payload: mobileNumber
});

export const userLogOutAction = () => {
  logout();
  history.push(routes.login);
  return { type: LOGOUT_SUCCESS };
};
