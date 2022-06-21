const tokenKey = "authenticationToken";
const refreshTokenKey = "authenticationRefreshToken";

function getToken() {
    return localStorage.getItem(tokenKey);
}

function setToken(token: string) {
    localStorage.setItem(tokenKey, token);
}

function deleteToken() {
    localStorage.removeItem(tokenKey);
}

function getRefreshToken() {
    return localStorage.getItem(refreshTokenKey);
}

function setRefreshToken(refreshToken: string) {
    localStorage.setItem(refreshTokenKey, refreshToken);
}

function deleteRefreshToken() {
    localStorage.removeItem(refreshTokenKey);
}

export { getToken, setToken, deleteToken, getRefreshToken, setRefreshToken, deleteRefreshToken };
