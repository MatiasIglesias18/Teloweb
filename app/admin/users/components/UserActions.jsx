"use client"
import React, { useState } from 'react';
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

const UserActions = ({ uid }) => {
  const [procesandoEliminacion, setProcesandoEliminacion] = useState(false);
  const [open, setOpen] = useState(false);

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

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Eliminar</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Estás seguro/a?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción es irreversible y eliminará permanentemente el usuario, sus datos, establecimientos, imágenes, reseñas y otros.
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
  );
};

export default UserActions;
