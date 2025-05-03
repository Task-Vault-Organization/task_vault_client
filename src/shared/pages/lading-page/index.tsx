import {FC} from "react";

export const LandingPage : FC = () => {
    return (
      <div className={'flex justify-center items-center min-h-[calc(100vh-5rem)]'}>
          <img
              src={'/src/assets/kitty.jpg'}
              alt={'kitty'}
              className={'w-200'}
          />
      </div>
    );
}