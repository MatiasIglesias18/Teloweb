"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import eliminarOperador from "@/app/utils/admin/usuarios/eliminarOperador";
import { AiOutlineLoading } from "react-icons/ai";
import { cambiarPasswdOperador } from "@/app/utils/admin/usuarios/cambiarPasswdOperador";

const UserActions = ({ uid }) => {
  const [procesandoEliminacion, setProcesandoEliminacion] = useState(false);
  const [procesandoCambioPasswd, setProcesandoCambioPasswd] = useState(false);
  const [openEliminar, setOpenEliminar] = useState(false);
  const [openCambioPasswd, setOpenCambioPasswd] = useState(false);
  const [newPasswd, setNewPasswd] = useState("");

  const handleEliminarUser = async (uid) => {
    setProcesandoEliminacion(true);
    const [result, error] = await eliminarOperador(uid);

    if (error) {
      console.log(error);
    } else if (result) {
      console.log(result);
    }
    setOpen(false);
    setProcesandoEliminacion(false);
  };

  const handleCambioPasswd = async (uid) => {
    setProcesandoCambioPasswd(true);
    //Genera un nuevo password
    const newPasswd = Math.random().toString(36).slice(-8);
    const [result, error] = await cambiarPasswdOperador(uid, newPasswd);

    if (error) {
      console.log(error);
    } else if (result) {
      setNewPasswd(newPasswd);
      console.log(result);
    }
    setProcesandoCambioPasswd(false);
  };

  return (
    <div className="flex gap-2">
      <AlertDialog open={openCambioPasswd} onOpenChange={setOpenCambioPasswd}>
        <AlertDialogTrigger asChild>
          <Button variant="secondary">Reset Contraseña</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Contraseña de User</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <>
                <p>
                  Se generará automáticamente una nueva clave de usuario para el
                  operador. Se le deberá comunicar al operador su nueva clave y
                  solcitarle que la cambie según su preferencia.
                </p>
                {newPasswd && (
                  <div className="">
                    <p className="text-red-500 font-semibold">
                      Clave generada con exito!
                    </p>
                    <p className="mt-0">
                      Nueva Contraseña:{" "}
                      <span className="font-bold">{newPasswd}</span>
                    </p>
                  </div>
                )}
              </>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction asChild>
              <>
                <Button
                  variant="destructive"
                  onClick={() => handleCambioPasswd(uid)}
                  disabled={procesandoCambioPasswd}
                >
                  {procesandoCambioPasswd ? (
                    <div className="flex items-center gap-2">
                      <AiOutlineLoading className="animate-spin" />
                      Reseteando contraseña...
                    </div>
                  ) : (
                    "Resetear Contraseña"
                  )}
                </Button>
              </>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={openEliminar} onOpenChange={setOpenEliminar}>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">Eliminar</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Estás seguro/a?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción es irreversible y eliminará permanentemente el
              usuario, sus datos, establecimientos, imágenes, reseñas y otros.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction asChild>
              <>
                <Button
                  variant="destructive"
                  onClick={() => handleEliminarUser(uid)}
                  disabled={procesandoEliminacion}
                >
                  {procesandoEliminacion ? (
                    <div className="flex items-center gap-2">
                      <AiOutlineLoading className="animate-spin" />
                      Eliminando Usuario...
                    </div>
                  ) : (
                    "Eliminar Usuario"
                  )}
                </Button>
              </>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserActions;
