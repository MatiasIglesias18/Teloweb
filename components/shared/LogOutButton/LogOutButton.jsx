"use client";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/config";
import { FaSignOutAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";

export default function LogOutButton() {
  const router = useRouter();
  async function signOutUser() {
    //Sign out with the Firebase client
    await signOut(auth);

    //Clear the cookies in the server
    const response = await fetch("/api/logout", {
      method: "POST",
    });

    //Redirect the user to the login page
    router.push("/login");
    
  }
  function handleLogout(e) {
    e.preventDefault;
    signOutUser();
  }

  return (
    <Button
      variant="ghost"
      className="justify-start flex gap-2 w-full text-md cursor-pointer"
      asChild
      onClick={handleLogout}
    >
      <div>
        <FaSignOutAlt />
        Cerrar Sesión
      </div>
    </Button>
  );
}
