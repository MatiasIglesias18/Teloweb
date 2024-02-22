"use client";
import { columns } from "./columns";

import { DataTable } from "@/components/ui/data-table";

import { collection, onSnapshot, where, query} from "firebase/firestore";
import { db } from "@/firebase/config";
import { useEffect, useState } from "react";
import { useTeloContext } from "@/app/context/TeloDocProvider";
import { ModalCodigoReserva } from "./ModalCodigoReserva";

export function ReservasTabla() {
  const [reservas, setReservas] = useState([]);
  const {teloDoc, teloRef} = useTeloContext();

  useEffect(() => {
    if (teloDoc) {
      const reservasCollection = query(collection(db, "reservas"), where("teloUid", "==", teloRef.id));

      const unsubscribe = onSnapshot(reservasCollection, (snapshot) => {
        const updatedReservas = snapshot.docs.map(async (doc) => {
          const data = doc.data();
          const fecha = data.fechaReserva.toDate();
          const opcionesFecha = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
          };
          const opcionesHora = {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
          }
          const formattedDate = fecha.toLocaleDateString(opcionesFecha);
          const formattedHour = fecha.toLocaleTimeString(opcionesHora);
          const formatedDateHourString = `${formattedDate} ${formattedHour}`;
          return {
            id: doc.id,
            uid: doc.id,
            fechaReserva: formatedDateHourString,
            numeroHabitacion: data.numeroHabitacion,
            habitacionRef: data.habitacionRef,
            estado: data.estado,
            tipoHabitacionName: data.tipoHabitacionName,
            tipoHabitacionRef: data.tipoHabitacionRef,
            tipoHabitacionUid: data.tipoHabitacionUid,
            teloRef: data.telo,
            teloUid: data.teloUid,
            precio: data.precio,
            userEmail: data.userEmail,
            userUid: data.userUid,
            codigo: data.codigo,
          };
        });
        Promise.all(updatedReservas).then((resArray) => {
          setReservas(resArray);
        });
      });

      return () => unsubscribe();
    }
  }, [teloDoc, teloRef.id]);

  return (
    <div className="w-full flex flex-col gap-5">
      <DataTable columns={columns} data={reservas} />
      <div className="w-full flex flex-row justify-center items-center">
      <ModalCodigoReserva />
      </div>
    </div>
  );
}
