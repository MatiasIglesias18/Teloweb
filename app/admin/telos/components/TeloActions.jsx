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
import { AiOutlineLoading } from "react-icons/ai";
import { eliminarTelo } from "@/app/utils/manejoTelos/eliminarTelo";

const TeloActions = ({ uid }) => {
  const [open, setOpen] = useState(false);
  const [procesandoEliminacion, setProcesandoEliminacion] = useState(false);

  const handleEliminarTelo = async (uid) => {
    setProcesandoEliminacion(true);
    const [result, error] = await eliminarTelo(uid);
    
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
          <AlertDialogTitle>¿Estás seguro/a?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción es irreversible y eliminará permanentemente el Telo, sus datos, imágenes, reseñas y otros.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction asChild>
            <>
              <Button
                variant="destructive"
                onClick={() => handleEliminarTelo(uid)}
                disabled={procesandoEliminacion}
              >
                {procesandoEliminacion ? (
                  <div className="flex gap-2 items-center">
                    <AiOutlineLoading className="animate-spin" />
                    Eliminando...
                  </div>
                ) : (
                  "Eliminar"
                )}
              </Button>
            </>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default TeloActions;
