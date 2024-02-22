import Profile from "@/components/shared/Profile/Profile";

const Page = () => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Mi cuenta</h1>
      <Profile tipoUsuario="admin"/>
    </div>
  );
};

export default Page;
