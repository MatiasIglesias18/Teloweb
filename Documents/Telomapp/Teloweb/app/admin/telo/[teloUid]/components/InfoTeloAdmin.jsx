"use client";
import { barriosCABA } from "@/app/utils/barriosCABA";
import { servicios } from "@/app/utils/serviciosTelos";
import { useTeloContext } from "@/app/context/TeloDocProvider";
import CarouselImagenesTelo from "@/app/dashboard/telos/[teloUid]/components/CarouselImagenesTelo/CarouselImagenesTelo";

export const InfoTeloAdmin = () => {
  const { teloDoc } = useTeloContext();
  const Pservicios = [];
  servicios.map((s) => {
    if (teloDoc?.servicios?.includes(s.id)) {
      Pservicios.push(s);
    }
  });

  return (
    <>
      <div className="flex flex-col ">
        <h2 className="text-3xl font-bold mb-4">Información de telo: {teloDoc?.nombre}</h2>
        <CarouselImagenesTelo />
        <h3 className="text-lg font-semibold mb-1 mt-4">Descripcion</h3>
        <p className="text-md mb-2">
          {teloDoc?.descripcion ? teloDoc?.descripcion : "No hay descripción"}
        </p>
        <h3 className="text-lg font-semibold mb-1">Barrio</h3>
        <p className="text-md mb-2">{barriosCABA[teloDoc?.barrio]}</p>
        <h3 className="text-lg font-semibold mb-1">Dirección</h3>
        <p className="text-md mb-2">
          {teloDoc?.direccion ? teloDoc?.direccion : "No hay dirección cargada"}
        </p>
        <h3 className="text-lg font-semibold mb-1">Coordenadas: </h3>
        <p className="text-md mb-2">{`Latitud: ${teloDoc?.geopoint?.latitud}, Longitud: ${teloDoc?.geopoint?.longitud}`}</p>
        <h3 className="text-lg font-semibold mb-1">Email de contacto</h3>
        <p className="text-md mb-2">
          {teloDoc?.email ? teloDoc?.email : "No hay email cargado"}
        </p>
        <h3 className="text-lg font-semibold mb-1">Telefono</h3>
        <p className="text-md mb-2">
          {teloDoc?.telefono ? teloDoc?.telefono : "No hay telefono cargado"}
        </p>
        <h3 className="text-lg font-semibold mb-1">Servicios</h3>
        {Pservicios.length === 0 ? (
          <p className="text-md mb-2">
            No hay servicios, agrega algunos desde el formulario de solicitud de
            cambios.
          </p>
        ) : (
          <ul className="list-disc list-inside text-md">
            {Pservicios.map((s) => (
              <li className="text-md mb-2" key={s.id}>
                {s.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};
