import { InfoTelo } from "./components/InfoTelo/InfoTelo";
import { SwitchPublicar } from "./components/SwitchPublicar/SwitchPublicar";
import { EliminarButton } from "./components/EliminarButton/EliminarButton";
import SolicutudAlta from "./components/SolicitudAlta/SolicitudAlta";
const Dashboard = ({ params }) => {
  return (
    <div className="flex flex-col gap-4">
    <SolicutudAlta />
    <div className="control-buttons flex flex-row gap-4 flex-wrap">
        
        <SwitchPublicar />
        <EliminarButton />
      </div>
      <InfoTelo />
    </div>
  );
};

export default Dashboard;
