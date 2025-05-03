import './app.css'
import { AlertList } from "./shared/components/Alerts/alert-list";
import { NavigationMenu } from "./shared/layouts/Navigation/navigation-menu";
import {Outlet} from "react-router";

function App() {
  return (
    <>
        <AlertList />
        <NavigationMenu />
        <div className={'pt-20'}>
            <Outlet />
        </div>
    </>
  )
}

export default App
