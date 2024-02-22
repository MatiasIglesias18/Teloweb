"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/app/context/AuthProvider";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  PopoverContent,
  PopoverTrigger,
  Popover,
} from "@/components/ui/popover";
import LogOutButton from "@/components/shared/LogOutButton/LogOutButton";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

const AvatarMenu = () => {
  const { user } = useAuthContext();
  const [userProfilePicture, setUserProfilePicture] = useState(
    user?.photoURL ? user.photoURL : null
  );
  const [userTipo, setUserTipo] = useState(null);

  useEffect(() => {
    // Obtener el tipo de usuario
    async function getTipoUsuario(userUid) {
      if (!userUid) {
        setUserTipo(null);
        return null;
      }
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      const userData = userDoc.data();
      if (userData) {
        setUserTipo(userData.tipoUsuario);
        return userData.tipoUsuario;
      }
    }
    getTipoUsuario(user?.uid);
  }, [user]);

  useEffect(() => {
    if (!user) {
      setUserProfilePicture(null);
      return;
    }
    setUserProfilePicture(user.photoURL);
  }, [user]);

  return (
    <div className="flex items-center justify-center">
      {user ? (
        <Popover>
          <PopoverTrigger>
            <div className="flex flex-row items-center justify-center gap-4 rounded-md py-2 px-5 bg-slate-100">
              <Avatar>
                <AvatarImage
                  src={userProfilePicture}
                  className="object-cover"
                />
                <AvatarFallback className="bg-white">CN</AvatarFallback>
              </Avatar>
              <span>{user.displayName}</span>
            </div>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="PopoverContent flex justify-center flex-col gap-2 "
          >
            <Button
              variant="ghost"
              className="justify-start flex gap-2 w-full text-md cursor-pointer"
              asChild
            >
              <Link href={userTipo === "admin" ? "/admin" : "/dashboard"}>
                Ir al panel
              </Link>
            </Button>
            <LogOutButton />
          </PopoverContent>
        </Popover>
      ) : (
        <Button asChild>
          <Link href="/login">Iniciar Sesión</Link>
        </Button>
      )}
    </div>
  );
};

export default AvatarMenu;
