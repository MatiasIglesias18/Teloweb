import Profile from "@/components/shared/Profile/Profile";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Page = () => {
  return (
    <>
      <Button asChild>
        <Link href="/dashboard">Volver al panel</Link>
      </Button>
      <h1 className="text-3xl font-bold text-black text-center">Mi cuenta</h1>
      <Profile tipoUsuario="operador" />
    </>
  );
};

export default Page;
