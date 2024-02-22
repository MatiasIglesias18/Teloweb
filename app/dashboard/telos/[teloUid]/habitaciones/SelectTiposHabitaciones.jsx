"use client";
import { useAuthContext } from "@/app/context/AuthProvider";
import { useEffect, useState } from "react";
import getTiposHabsFromUid from "@/app/utils/manejoTipoHabitaciones/getTiposHabsFromUid";


/*Crear funcion para get tipo de habitacion a partir de telouid*/
export default function SelectTiposHabitaciones() {
  const { user } = useAuthContext();
  const [tiposHabitacionesArray, setTiposHabitacionesArray] = useState([]);
  useEffect(() => {
    getTiposHabsFromUid(user.uid).then((result, error) => {
      const arrayHabData = [];
      result.forEach((tipoHab) => {
        arrayHabData.push(tipoHab);
      });
      setTiposHabitacionesArray(arrayHabData);
    });
  }, [user.uid]);

  return (
    <>
      {tiposHabitacionesArray.map((tipoHab, index) => {
        const data = tipoHab.data();
        const id = tipoHab.id;
        return <option key={id} value={id}>{data.nombre}</option>;
      })}
    </>
  );
}


