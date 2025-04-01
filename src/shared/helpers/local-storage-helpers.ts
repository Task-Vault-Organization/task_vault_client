import {JWT_TOKEN_LOCAL_STORAGE_KEY} from "../../config/constants.ts";

export const clearLocalStorage = () => {
    localStorage.clear();
}

export const localStorageLogout = () => {
    localStorage.removeItem('authentication-storage');
    localStorage.removeItem(JWT_TOKEN_LOCAL_STORAGE_KEY);
}