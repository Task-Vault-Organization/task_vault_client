import { create, StoreApi } from "zustand";
import { AuthenticationState } from "../types/authentication-state.ts";
import { GetUser } from "../../../shared/types/get-user.ts";
import { persist } from "zustand/middleware";

export const useAuthenticationStore: StoreApi<AuthenticationState> = create<AuthenticationState>(
    persist(
        (set) => ({
            isAuthenticated: false,
            user: null,
            loading: false,
            jwtToken: '',
            authenticateUserStore: (isAuthenticated: boolean, user: GetUser, jwtToken: string) => set(() => ({
                isAuthenticated: isAuthenticated,
                user: user,
                loading: false,
                jwtToken: jwtToken
            })),
            setUser: (user: GetUser) => set((state) => ({
                ...state,
                user
            })),
            setLoading: () => set((state: AuthenticationState) => ({
                ...state,
                loading: true
            })),
            logoutStore: () => set(() => ({
                isAuthenticated: false,
                user: null,
                loading: false,
                jwtToken: ''
            }))
        }),
        {
            name: 'authentication-storage'
        }
    )
);