import TablaCambios from "./componentes/TablaCambios/TablaCambios";

const Page = () => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">
        Solicitudes de cambio pendientes
      </h1>
      <TablaCambios />
    </div>
  );
};

export default Page;