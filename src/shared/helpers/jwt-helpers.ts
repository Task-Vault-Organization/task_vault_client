import {JWT_TOKEN_LOCAL_STORAGE_KEY} from "../../config/constants.ts";

export const setJwtToken = (jwtToken: string) => {
    localStorage.setItem(JWT_TOKEN_LOCAL_STORAGE_KEY, jwtToken);
}

export const getJwtToken = () : string | null => {
    const jwtToken = localStorage.getItem(JWT_TOKEN_LOCAL_STORAGE_KEY);
    if (!jwtToken) return null;
    return jwtToken;
}