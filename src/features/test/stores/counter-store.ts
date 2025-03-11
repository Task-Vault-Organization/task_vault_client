import { create } from "zustand";
import { CounterSate } from "../types/counter-sate.ts";

export const useCounterStore = create<CounterSate>((set) => ({
    count: 0,
    increaseCounter: () => set((state) => ({ count: state.count + 1 })),
    decreaseCounter: () => set((state) => {
        if (state.count > 0)
            return ({ count: state.count - 1 })
        return state;
    })
}))