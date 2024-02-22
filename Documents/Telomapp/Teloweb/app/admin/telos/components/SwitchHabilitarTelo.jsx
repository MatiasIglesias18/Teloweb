"use client";
import deshabilitarTelo from "@/app/utils/admin/telos/deshabilitarTelo";
import habilitarTelo from "@/app/utils/admin/telos/habilitarTelo";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

export default function SwitchHabilitarTelo({ teloHabilitado, uid }) {
  const [procesando, setProcesando] = useState(false);

  function handleHabilitarTelo(teloHabilitado) {
    if (procesando) {
      return;
    }
    (async () => {
      try {
        setProcesando(true);

        if (teloHabilitado) {
          const result = await habilitarTelo(uid);
          if (result.error) {
            console.error("Error al habilitar Telo:", result.error);
            return;
          }
        } else {
          const result = await deshabilitarTelo(uid);
          if (result.error) {
            console.error("Error al deshabilitar Telo:", result.error);
            return;
          }
        }
      } catch (error) {
        console.error("Error en handleHabilitarTelo:", error);
      } finally {
        setProcesando(false);
      }
    })();
  }

  return (
    <Switch
      name="teloHabilitado"
      checked={teloHabilitado}
      onCheckedChange={handleHabilitarTelo}
      disabled={procesando}
    />
  );
}
