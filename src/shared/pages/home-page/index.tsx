import {FC} from "react";

export const HomePage : FC = () => {
    return (
        <div className={'flex justify-center items-center min-h-[calc(100vh-5rem)]'}>
            <img
                src={'/src/assets/kitty2.png'}
                alt={'kitty'}
                className={'w-200'}
            />
        </div>
    );
}