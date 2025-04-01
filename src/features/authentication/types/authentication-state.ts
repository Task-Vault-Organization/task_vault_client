import {GetUser} from "../../../shared/types/get-user.ts";

export type AuthenticationState = {
    isAuthenticated: boolean,
    user: GetUser | null,
    loading: false
    jwtToken: string | ''
}