import TablaAltasTelo from "./components/TablaCambios/TablaAltasTelo";

const Page = () => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold ">Solicitudes de Alta de Telos</h1>
      <TablaAltasTelo />
    </div>
  );
};

export default Page;
