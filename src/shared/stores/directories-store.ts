import { create, StoreApi } from "zustand";
import { persist } from "zustand/middleware";
import { DirectoriesState } from "../types/directories-state.ts";
import { Directory } from "../types/directory.ts";

export const useDirectoriesStore: StoreApi<DirectoriesState> = create<DirectoriesState>(
    persist(
        (set) => ({
            directoriesStack: [],

            push: (directoryId: string, directoryName: string) => {
                const newDir: Directory = { id: directoryId, name: directoryName };
                set((state) => ({
                    directoriesStack: [...state.directoriesStack, newDir]
                }));
            },

            pop: () => {
                set((state) => ({
                    directoriesStack: state.directoriesStack.slice(0, -1)
                }));
            },

            goTo: (directoryId: string) => {
                set((state) => {
                    const index = state.directoriesStack.findIndex((dir) => dir.id === directoryId);
                    if (index === -1) return state;
                    return {
                        directoriesStack: state.directoriesStack.slice(0, index + 1)
                    };
                });
            }
        }),
        {
            name: "directories-storage"
        }
    )
);