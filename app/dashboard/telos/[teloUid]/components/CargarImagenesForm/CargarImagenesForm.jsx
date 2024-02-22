"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { AiOutlineLoading } from "react-icons/ai";

import { useEffect, useState } from "react";
import { useTeloContext } from "@/app/context/TeloDocProvider";

import solicitarUpdateFotosTelo from "@/app/utils/manejoTelos/solicitarUpdateFotosTelo";

import {
  Dialog,
  DialogContent as DialogContentNormal,
  DialogTrigger as DialogTriggerNormal,
} from "@/components/ui/dialog";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";

const CargarImagenesForm = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [procesandoForm, setProcesandoForm] = useState(false);
  const { teloDoc, teloRef } = useTeloContext();
  const [cambiosPendientes, setCambiosPendientes] = useState(false);

  useEffect(() => {
    (async () => {
      const queryCambios = query(
        collection(db, "cambios"),
        where("teloUid", "==", teloRef?.id),
        where("estado", "==", "pendiente"),
        where("type", "==", "fotosTelo")
      );
      const querySnapshot = await getDocs(queryCambios);
      if (!querySnapshot.empty) {
        setCambiosPendientes(true);
        return;
      }
      setCambiosPendientes(false);
    })()
  });

  const handleSubirImagenes = async (e) => {
    e.preventDefault();
    setProcesandoForm(true);
    //get files from inputs
    const files = e.target.querySelectorAll("input");
    const filesArray = Array.from(files)
      .filter((input) => input.type === "file")
      .map((input) => input.files[0]);
    console.log(filesArray);

    //upload files y crear el cambio
    const [result, error] = await solicitarUpdateFotosTelo(teloRef, filesArray);
    if (error) {
      console.error(error);
    } else {
      console.log("Imagenes cargadas exitosamente: ", result);
    }
    setOpenDialog(false);
    setProcesandoForm(false);
  };

  return (
    <>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTriggerNormal asChild>
          <div>
            <Button className="max-w-xs">Solicitar Cambio de Imagenes</Button>
            {cambiosPendientes && (
              <p className="text-red-700 font-semibold text-sm mx-auto text-center">
                (!) Hay cambios pendientes
              </p>
            )}
          </div>
        </DialogTriggerNormal>
        <DialogContentNormal>
          <h2 className="text-2xl font-bold mb-2">
            Solicitar cambio de Imágenes
          </h2>
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => handleSubirImagenes(e)}
          >
            <div className="grid grid-cols-2 gap-4">
              {/* Repetir este bloque para cada imagen */}
              {[...Array(6)].map((_, index) => (
                <div key={index} className="flex flex-col items-center gap-1.5">
                  <Label htmlFor={`imagen${index + 1}`}>{`Imagen ${
                    index + 1
                  }`}</Label>
                  <Input
                    id={`imagen${index + 1}`}
                    type="file"
                    name={`imagen${index + 1}`}
                    accept="image/jpeg, image/png"
                  />
                </div>
              ))}
              {/*Submit*/}
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                variant="default"
                className="ml-full"
                disabled={procesandoForm}
              >
                {procesandoForm ? (
                  <span className="flex justify-center items-center gap-2">
                    <AiOutlineLoading
                      className="animate-spin"
                      style={{ fontSize: "1.5em" }}
                    />{" "}
                    Procesando...
                  </span>
                ) : (
                  "Enviar solicitud de cambios"
                )}
              </Button>
            </div>
          </form>
        </DialogContentNormal>
      </Dialog>
    </>
  );
};

export default CargarImagenesForm;
