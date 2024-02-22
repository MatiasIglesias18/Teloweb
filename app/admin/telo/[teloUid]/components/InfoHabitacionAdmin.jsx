"use client";
import CarouselImagenesTipoHabAdmin from "./CarouselImagenesTipoHabAdmin";
export const InfoHabitacionAdmin = ({ tipoHabitacionDoc }) => {
  const tipoHabitacionData = tipoHabitacionDoc.data();

  return (
    <div className="flex flex-col gap-0 mt-4 ">
      <h2 className="text-2xl font-bold mb-4">{tipoHabitacionData.nombre}</h2>
      <CarouselImagenesTipoHabAdmin tipoHabitacionDoc={tipoHabitacionDoc} />
      <h3 className="text-lg font-semibold mb-1 mt-4">Nombre Público</h3>
      <p className="text-md mb-2">{tipoHabitacionData.nombrePublico}</p>
      <h3 className="text-lg font-semibold mb-1">Descripcion</h3>
      <p className="text-md mb-2">{tipoHabitacionData.descripcion}</p>
      <h3 className="text-lg font-semibold mb-1">Precio</h3>
      <p className="text-md mb-2">{tipoHabitacionData.precio}</p>
    </div>
  );
};
