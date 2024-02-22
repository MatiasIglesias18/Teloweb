"use client";
import { useTeloContext } from "@/app/context/TeloDocProvider";
import { InfoTeloAdmin } from "./InfoTeloAdmin";
import { ListInfoHabitacionesAdmin } from "./ListInfoHabitacionesAdmin";
export const TeloViewer = () => {
  const { teloDoc } = useTeloContext();
  return (
    <>
      {teloDoc ? (
        <>
          <InfoTeloAdmin />
          <h2 className="text-3xl font-bold mt-4 mb-2">Tipos Habitaciones</h2>
          <ListInfoHabitacionesAdmin />
        </>
      ) : (
        <p>El telo no existe en la base de datos.</p>
      )}
    </>
  );
};
