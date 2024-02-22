"use client";
import { deshabilitarOperador } from "@/app/utils/admin/usuarios/deshabilitarOperador";
import { habilitarOperador } from "@/app/utils/admin/usuarios/habilitarOperador";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

export default function SwitchHabilitarUsuario({ userDesHabilitado, uid }) {
  const [procesando, setProcesando] = useState(false);

  function handleHabilitarUser(userDesHabilitado) {
    if (procesando) {
      return;
    }
    (async () => {
      try {
        setProcesando(true);

        if (userDesHabilitado) {
          const result = await habilitarOperador(uid);
          if (result.error) {
            console.error("Error al habilitar operador:", result.error);
            return;
          }
        } else {
          const result = await deshabilitarOperador(uid);
          if (result.error) {
            console.error("Error al deshabilitar operador:", result.error);
            return;
          }
        }
      } catch (error) {
        console.error("Error en handleHabilitarOperador:", error);
      } finally {
        setProcesando(false);
      }
    })();
  }

  return (
    <Switch
      name="userHabilitado"
      checked={!userDesHabilitado}
      onCheckedChange={handleHabilitarUser}
      disabled={procesando}
    />
  );
}
