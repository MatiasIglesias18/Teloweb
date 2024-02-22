import { TelosTabla } from "./components/TelosTabla";

const Page = () => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Administrar Telos</h1>
      <TelosTabla />
    </div>
  );
};

export default Page;
