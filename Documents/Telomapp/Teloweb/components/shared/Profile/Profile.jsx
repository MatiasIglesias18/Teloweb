"use client";
import { useRouter } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuthContext } from "@/app/context/AuthProvider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FaEdit } from "react-icons/fa";
import { useRef, useState } from "react";
import { auth } from "@/firebase/config";
import { storage } from "@/firebase/config";
import subirImagenAFireBaseStorage from "@/app/utils/firebaseStorage/subirImagenAFireBaseStorage";
import {
  updateProfile,
  reauthenticateWithCredential,
  updateEmail,
  EmailAuthProvider,
  updatePassword
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { Button } from "@/components/ui/button";
import { AiOutlineLoading } from "react-icons/ai";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { getDownloadURL } from "firebase/storage";

const Profile = ({ tipoUsuario }) => {
  const router = useRouter();
  const { user } = useAuthContext();
  const [avatar, setAvatar] = useState(auth?.currentUser?.photoURL);
  const [cargandoNameChange, setCargandoNameChange] = useState(false);
  const [cargandoEmailChange, setCargandoEmailChange] = useState(false);
  const [cargandoPasswdChange, setCargandoPasswdChange] = useState(false);
  const [openDialogEmail, setOpenDialogEmail] = useState(false);
  const [openDialogPasswd, setOpenDialogPasswd] = useState(false);
  const displayNameInputRef = useRef(null);
  const archivoRef = useRef(null);
  const emailInputRef = useRef(null);
  const passwdInputRef = useRef(null);
  const newPasswdInputRef = useRef(null);
  const oldPasswdInputRef = useRef(null);
  let tipoUsuarioRuta = "";

  if (tipoUsuario === "admin") {
    tipoUsuarioRuta = "admins";
  } else if (tipoUsuario === "operador") {
    tipoUsuarioRuta = "operadores";
  }

  const handleChangePasswd = async (e) => {
    setCargandoPasswdChange(true);
    const currentUser = auth.currentUser;
    const credentials = EmailAuthProvider.credential(
      currentUser.email,
      oldPasswdInputRef.current.value
    )
    await reauthenticateWithCredential(currentUser, credentials);
    await updatePassword(currentUser, newPasswdInputRef.current.value);
    const token = await currentUser.getIdToken();
    await fetch("/api/login", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    setCargandoPasswdChange(false);
    setOpenDialogPasswd(false);
    router.refresh();

  }

  const handleChangeDisplayName = async (e) => {
    setCargandoNameChange(true);
    await updateProfile(auth.currentUser, {
      displayName: displayNameInputRef.current.value,
    });
    setCargandoNameChange(false);
  };
  const handleChangeEmail = async (e) => {
    setCargandoEmailChange(true);
    const currentUser = auth.currentUser;
    const credentials = EmailAuthProvider.credential(
      currentUser.email,
      passwdInputRef.current.value
    );
    await reauthenticateWithCredential(auth.currentUser, credentials);
    await updateEmail(auth.currentUser, emailInputRef.current.value);
    const token = await currentUser.getIdToken();
    await fetch("/api/login", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    //cambia el campo email en el documento user de la base de datos
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      const newUserDoc = {
        ...userDoc.data(),
        email: currentUser.email,
      };
      await setDoc(doc(db, "users", user.uid), newUserDoc);
    }
    setCargandoEmailChange(false);
    setOpenDialogEmail(false);
    router.refresh();
  };

  const handleClickEditarAvatar = () => {
    archivoRef.current.click();
  };

  const handleAvatarImageSelected = async (file) => {
    //Limpiar valor de input
    archivoRef.current.value = "";

    //subir imagen a firestorage
    if (!file || !user || !tipoUsuarioRuta) {
      return;
    }
    if (!file.type.startsWith("image/")) {
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      return;
    }
    //Cambiamos el nombre del archivo a avatar
    const nuevoNombre = "avatar"; // Nuevo nombre que deseas asignar
    const fileAvatar = new File([file], nuevoNombre, { type: file.type });
    //Subimos la imagen a firestore
    const [result, error] = await subirImagenAFireBaseStorage(
      storage,
      fileAvatar,
      `${tipoUsuarioRuta}/${user.uid}`
    );

    if (error) {
      console.log("Error al subir la imagen");
      return;
    }
    if (result) {
      const downloadUrl = await getDownloadURL(result)
      await updateProfile(auth.currentUser, {
        photoURL: downloadUrl,
      });
      setAvatar(downloadUrl);
    }
  };
  return (
    <>
      <div className="flex justify-center items-center gap-4 my-4">
        <div className="relative">
          <Avatar className="w-20 h-20">
            <AvatarImage src={avatar} className="object-cover" />
            <AvatarFallback className="bg-gray-300">CN</AvatarFallback>
          </Avatar>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={archivoRef}
            onChange={(e) => {
              handleAvatarImageSelected(e.target.files[0]);
            }}
          />
          <button
            className="absolute bottom-[0] right-[5px] rounded-full bg-pink-600 p-1.5 border-solid border-2 border-white hover:bg-pink-500"
            onClick={handleClickEditarAvatar}
          >
            <FaEdit className="text-white text-xs" />
          </button>
        </div>
        <span>{user?.displayName ? user?.displayName : user?.email}</span>
      </div>
      <ul className="mx-auto max-w-md w-full flex flex-col gap-4">
        <li className="flex flex-col gap-2">
          <Label htmlFor={"displayName"}>{"Nombre: "}</Label>
          <div className="flex flex-row gap-2">
            <Input
              id="displayName"
              type="text"
              ref={displayNameInputRef}
              name="nombre"
              disabled={cargandoNameChange}
              defaultValue={
                user?.displayName
                  ? user?.displayName
                  : "No se ha registrado un nombre"
              }
            />
            <Button
              className="ml-auto"
              disabled={cargandoNameChange}
              onClick={(e) => handleChangeDisplayName(e)}
            >
              {cargandoNameChange ? (
                <span className="flex justify-center items-center gap-2">
                  <AiOutlineLoading
                    className="animate-spin"
                    style={{ fontSize: "1.5em" }}
                  />{" "}
                  Procesando...
                </span>
              ) : (
                "Cambiar"
              )}
            </Button>
          </div>
        </li>
        <li className="flex flex-col gap-2">
          <Label htmlFor={"email"}>{"Email: "}</Label>
          <div className="flex flex-row gap-2">
            <Input id="email" name="emailOriginal" defaultValue={user?.email} disabled />
            <Dialog open={openDialogEmail} onOpenChange={setOpenDialogEmail}>
              <DialogTrigger asChild>
                <Button>Cambiar</Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Cambiar Email</DialogTitle>
                  <DialogDescription>Escribe un nuevo email</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-2">
                  <Label htmlFor={"email"}>{"Email: "}</Label>
                  <Input
                    type="email"
                    name="newEmail"
                    ref={emailInputRef}
                    disabled={cargandoEmailChange}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor={"passwd"}>{"Contraseña: "}</Label>
                  <Input
                    name="passwd"
                    type="password"
                    id="passwd"
                    ref={passwdInputRef}
                    disabled={cargandoEmailChange}
                  />
                  <Button
                    className="ml-auto"
                    disabled={cargandoEmailChange}
                    onClick={(e) => handleChangeEmail(e)}
                  >
                    {cargandoEmailChange ? (
                      <span className="flex justify-center items-center gap-2">
                        <AiOutlineLoading
                          className="animate-spin"
                          style={{ fontSize: "1.5em" }}
                        />{" "}
                        Procesando...
                      </span>
                    ) : (
                      "Cambiar"
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </li>
        <li className="flex-col gap-2">
            <Dialog open={openDialogPasswd} onOpenChange={setOpenDialogPasswd}>
              <DialogTrigger asChild>
                <Button className="w-full">Cambiar contraseña</Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Cambiar contraseña</DialogTitle>
                  <DialogDescription>Escribe una nueva contraseña</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-2">
                  <Label htmlFor={"oldPasswd"}>{"Contraseña anterior: "}</Label>
                  <Input
                    type="password"
                    id="oldPasswd"
                    name="oldPasswd"
                    ref={oldPasswdInputRef}
                    disabled={cargandoPasswdChange}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor={"newPasswd"}>{"Contraseña nueva: "}</Label>
                  <Input
                    type="password"
                    name="newPasswd"
                    id="newPasswd"
                    ref={newPasswdInputRef}
                    disabled={cargandoPasswdChange}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    className="ml-auto"
                    disabled={cargandoPasswdChange}
                    onClick={(e) => handleChangePasswd(e)}
                  >
                    {cargandoPasswdChange ? (
                      <span className="flex justify-center items-center gap-2">
                        <AiOutlineLoading
                          className="animate-spin"
                          style={{ fontSize: "1.5em" }}
                        />{" "}
                        Procesando...
                      </span>
                    ) : (
                      "Cambiar"
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
      
        </li>  
      </ul>
    </>
  );
};

export default Profile;
