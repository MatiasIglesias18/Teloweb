"use client";
import { useTeloContext } from "@/app/context/TeloDocProvider";
import { collection, getDocs, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { InfoHabitacionAdmin } from "./InfoHabitacionAdmin";

export const ListInfoHabitacionesAdmin = () => {
  const { teloRef } = useTeloContext();
  const [tipoHabitaciones, setTipoHabitaciones] = useState([]);

  useEffect(() => {
    //Obtener la lista de tipos de habitaciones de la subcoleccion "tiposHabitacion" dentro de teloDoc
    //y setearla en el estado
    // console.log("teloDoc", teloDoc);
    const getTiposHabitaciones = async () => {
      try {
        if (teloRef) {
          const tiposHabitacionCol = collection(teloRef, "tiposHabitacion");
          const tiposHabitacionDocs = await getDocs(tiposHabitacionCol);
          if (tiposHabitacionDocs.empty) {
            setTipoHabitaciones([]);
          } else {
            setTipoHabitaciones(tiposHabitacionDocs.docs);
          }
        }
      } catch (error) {
        setTipoHabitaciones([]);
        console.log(error);
      }
    };
    getTiposHabitaciones();
  }, []);
  return tipoHabitaciones ? (
    tipoHabitaciones.map((tipoHabitacionDoc) => (
      <InfoHabitacionAdmin
        key={tipoHabitacionDoc.id}
        tipoHabitacionDoc={tipoHabitacionDoc}
      />
    ))
  ) : (
    <p>No hay tipos de habitaciones disponibles</p>
  );
};
