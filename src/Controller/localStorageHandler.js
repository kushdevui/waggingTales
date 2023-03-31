export const USER_TOKEN = "user_token";

export function logout() {
  clearUserToken();
}

export function setUserToken(TOKEN) {
  localStorage.setItem(USER_TOKEN, TOKEN);
}

export function getUserToken() {
  return localStorage.getItem(USER_TOKEN);
}

export function clearUserToken() {
  localStorage.removeItem(USER_TOKEN);
}

export function isLoggedIn() {
  const accessToken = getUserToken();
  return !!accessToken;
}
