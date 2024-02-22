import { UsersTabla } from "./components/UsersTabla";
import { ModalAgregarUser } from "./components/ModalAgregarUser/ModalAgregarUser";

const Habitaciones = () => {

  return (
    <div className="flex flex-col gap-4">
    <h1 className="text-3xl font-bold">Tabla de Usuarios Operadores</h1>
      <UsersTabla />
      <div className="w-full flex flex-row justify-center items-center">
        <ModalAgregarUser />
      </div>
    </div>
  );
};

export default Habitaciones;