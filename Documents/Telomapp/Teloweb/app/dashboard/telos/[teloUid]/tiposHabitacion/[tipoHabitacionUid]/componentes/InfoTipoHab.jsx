"use client";
import { useTipoHabContext } from "@/app/context/TipoHabProvider";
import CarouselImagenesTipoHab from "./CarouselImagenesTipoHab/CarouselImagenesTipoHab";
import { FormularioDatosTipoHabitacion } from "./FormularioTipoHabitacion/FormularioDatosTipoHabitacion";
import TipoHabCargarImagenesForm from "./TipoHabCargarImagenesForm/TipoHabCargarImagenesForm";
export const InfoTipoHab = () => {
  const { tipoHabitacionDoc } = useTipoHabContext();
  const tipoHabitacionData = tipoHabitacionDoc.data();

  return (
    <>
      <div className="flex flex-col gap-0 ">
        <h2 className="text-3xl font-bold mb-4">
          Información de Tipo de Habitación
        </h2>
        <CarouselImagenesTipoHab />
        <h3 className="text-lg font-semibold mb-1 mt-4">Nombre Público</h3>
        <p className="text-md mb-2">{tipoHabitacionData.nombrePublico}</p>
        <h3 className="text-lg font-semibold mb-1">Descripcion</h3>
        <p className="text-md mb-2">{tipoHabitacionData.descripcion}</p>
        <h3 className="text-lg font-semibold mb-1">Precio</h3>
        <p className="text-md mb-2">{tipoHabitacionData.precio}</p>
      </div>
      <div className="flex flex-row gap-4 flex-wrap">
        <TipoHabCargarImagenesForm />
        <FormularioDatosTipoHabitacion />
      </div>
    </>
  );
};
