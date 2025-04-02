import './App.css'
import { AlertList } from "./shared/components/Alerts/alert-list";
import { NavigationMenu } from "./shared/layouts/Navigation/NavigationMenu";
import {Outlet} from "react-router";

function App() {
  return (
    <>
        <AlertList />
        <NavigationMenu />
        <div className={'p-10'}>
            <Outlet />
        </div>
    </>
  )
}

export default App
