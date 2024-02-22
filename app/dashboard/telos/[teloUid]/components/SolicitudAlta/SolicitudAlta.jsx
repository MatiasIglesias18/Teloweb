"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useTeloContext } from "@/app/context/TeloDocProvider";
import solicitarAlta from "@/app/utils/manejoTelos/solicitarAlta";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";
const SolicutudAlta = () => {
  const { teloDoc, teloRef } = useTeloContext();
  const [disabled, setDisabled] = useState("");
  const [badgeColor, setBadgeColor] = useState("");
  const [badgeText, setBadgeText] = useState("");
  const [estadoHabilitacion, setEstadoHabilitacion] = useState("");

  const textosExplicativos = {
    habilitado:
      "Tu telo se encuentra Habilitado, esto significa que fué aprobado y que puedes habilitar su publicación",
    deshabilitado:
      "Tu telo se encuentra Deshabilitado esto significa que tu telo no ha sido aprobado y que no puedes habilitar su publicación, por favor corrobora los datos del telo y las imágenes que hayas cargado, luego solicita que el telo sea habilitado",
    pendiente:
      "Tu telo se encuentra en revisión, por favor espera hasta que el administrador apruebe tu telo para que puedas habilitar su publicación",
  };

  async function checkHabilitado() {
    if (!teloDoc) {
      return;
    }
    if (teloDoc?.habilitado === true) {
      setBadgeColor("bg-green-500 hover:bg-green-600");
      setBadgeText("Habilitado");
      setDisabled(true);
      setEstadoHabilitacion("habilitado");
      return;
    }

    //Si no está habilitado tenemos que chequear si existe un cambio pendinte que intente aplicar el habilitado
    const queryCambios = query(
      collection(db, "cambios"),
      where("teloUid", "==", teloDoc?.uid),
      where("type", "==", "altaTelo"),
      where("estado", "==", "pendiente")
    );
    const queryCambiosSnapshot = await getDocs(queryCambios);

    //Si existe un cambio pendiente entonces la habilitacion está en revisión
    if (!queryCambiosSnapshot.empty) {
      setBadgeColor("bg-yellow-500 hover:bg-yellow-600");
      setBadgeText("Pendiente");
      setEstadoHabilitacion("pendiente");
      setDisabled(true);
      return;
    } else {
      //Está deshabilitado
      setBadgeColor("bg-red-500 hover:bg-red-600");
      setBadgeText("Deshabilitado");
      setEstadoHabilitacion("deshabilitado");
      setDisabled(false);
      return;
    }
  }

  useEffect(() => {
    checkHabilitado();
  }, [teloDoc, checkHabilitado]);

  async function handleSolicitudAlta() {
    setDisabled(true);
    const values = { habilitado: true };
    const [result, error] = await solicitarAlta(
      values,
      teloRef?.id,
      teloDoc?.uid
    );
    await checkHabilitado();
    if (result) {
      console.log(result);
    } else if (error) {
      console.error(error);
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className=" font-bold mb-2 max-w-sm flex flex-col gap-2 items-center border p-4 border rounded">
            <div className="text-2xl font-bold flex items-center gap-2">
              <span className="line-height-[0]">Habilitación: </span>
              <div className="relative top-[-3px]">
                <Badge
                  className={`${badgeColor} text-white text-sm cursor-default`}
                >
                  {badgeText}
                </Badge>
              </div>
            </div>

            <Button
              id="telo-habilitado"
              name="telo-habilitado"
              disabled={disabled}
              onClick={handleSolicitudAlta}
            >
              Solicitar Habilitación
            </Button>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <span className="font-sm font-normal text-red-500">
            {textosExplicativos[estadoHabilitacion]}
          </span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SolicutudAlta;
