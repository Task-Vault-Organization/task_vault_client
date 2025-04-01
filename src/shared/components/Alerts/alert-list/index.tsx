import {FC} from "react";
import {useAlertsStore} from "../../../stores/alerts-store.ts";
import {Alert as AlertType} from "../../../types/alert.ts";
import {Alert} from "../alert";
import '../alerts.css';

export const AlertList : FC = () => {
    const alerts = useAlertsStore((state) => state.alerts);
    return(
      <div className={'container fixed bottom-5 left-5'}>
          {
              alerts.map((alert: AlertType) => (
                  <Alert key={alert.id} alert={alert}/>
              ))
          }
      </div>
    );
}