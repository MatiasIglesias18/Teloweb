"use client";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTeloContext } from "@/app/context/TeloDocProvider";

import { updateDoc } from "firebase/firestore";
export const SwitchPublicar = () => {
  const { teloDoc, teloRef } = useTeloContext();

  function handlePublicarTelo(checked) {
    (async (checked) => {
      if (checked) {
        await updateDoc(teloRef, { publicado: true });
        console.log("Telo publicado");
      } else {
        await updateDoc(teloRef, { publicado: false });
        console.log("Telo ocultado");
      }
    })(checked);
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className=" font-bold mb-2 max-w-sm flex flex-row gap-6 items-center border p-4 border rounded">
            <div
              htmlFor="telo-publicado"
              className="flex flex-col justify-center"
            >
              <h2 className="text-2xl font-bold">Publicado</h2>
              <p className="text-sm font-normal">
                Determina si el telo se muestra o no en la aplicación{" "}
              </p>
            </div>
            <Switch
              id="telo-publicado"
              name="telo-publicado"
              checked={teloDoc?.publicado}
              onCheckedChange={handlePublicarTelo}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <span className="font-sm font-normal text-red-500">
            *este cambio es instantáneo y no requiere confirmación
          </span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
