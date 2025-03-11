import {useCounterStore} from "../stores/counter-store.ts";

export function TestComponent() {
    const counter = useCounterStore((state) => state.count);
    const increaseCounter = useCounterStore((state) => state.increaseCounter);
    const decreaseCounter = useCounterStore((state) => state.decreaseCounter);

    return (
        <div className={"p-10"}>
            <h2>Test component!</h2>
            <p>{counter}</p>
            <button className={"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-8"} onClick={increaseCounter}>Increase counter</button>
            <button className={"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"} onClick={decreaseCounter}>Decrease counter</button>
        </div>
    )
}