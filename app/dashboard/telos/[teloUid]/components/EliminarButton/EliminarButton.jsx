"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useTeloContext } from "@/app/context/TeloDocProvider";
import { eliminarTelo } from "@/app/utils/manejoTelos/eliminarTelo";
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

export const EliminarButton = () => {
  const { teloDoc, teloRef } = useTeloContext();
  const router = useRouter();
  function handleEliminarTelo(checked) {
    (async (checked) => {
      await eliminarTelo(teloRef.id);
      console.log("Telo eliminado");
      router.push("/dashboard");
    })(checked);
  }

  return (
    <div className=" font-bold mb-2 max-w-sm flex flex-row gap-6 items-center border p-4 border rounded">
      <div className="flex flex-col justify-center">
        <h2 className="text-2xl font-bold">Eliminar Telo</h2>
        <p className="text-sm font-normal">
          Desde aquí puedes eliminar el establecimiento.
        </p>
      </div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" id="telo-publicado">
            Eliminar Telo
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro/a?</AlertDialogTitle>
            <AlertDialogDescription>
              Se{" "}
              <b className="text-black">
                eliminará permanentemente {`${teloDoc?.nombre}`}
              </b>{" "}
              de la base de datos y nuestros servidores. Esta acción no se puede
              deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction asChild>
              <>
                <Button onClick={handleEliminarTelo} variant="destructive">
                  Eliminar
                </Button>
              </>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
