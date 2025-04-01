import './App.css'
import { AlertList } from "./shared/components/Alerts/alert-list";
import { NavigationMenu } from "./shared/layouts/Navigation/NavigationMenu";
import {Outlet} from "react-router";

function App() {
  return (
    <>
        <AlertList />
        <NavigationMenu />
        <Outlet />
    </>
  )
}

export default App
