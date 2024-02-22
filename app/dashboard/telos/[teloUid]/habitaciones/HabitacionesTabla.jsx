"use client";
import { columns } from "./columns";

import { DataTable } from "@/components/ui/data-table";

import { collection, getDoc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import getTeloDocFromUid from "@/app/utils/manejoTelos/getTeloDocFromUid";
import { useAuthContext } from "@/app/context/AuthProvider";
import { useParams } from "next/navigation";
import ModalAgregarHab from "./ModalAgregarHab";

export function HabitacionesTabla() {
  const params = useParams();
  const [habitaciones, setHabitaciones] = useState([]);
  const [teloDoc, setTeloDoc] = useState();

  useEffect(() => {
    getTeloDocFromUid(decodeURI(params.teloUid)).then((result, error) => {
      setTeloDoc(result);
    });
  }, [params.teloUid]);

  useEffect(() => {
    if (teloDoc) {
      const habitacionesCollection = collection(teloDoc.ref, "habitaciones");

      const unsubscribe = onSnapshot(habitacionesCollection, (snapshot) => {
        const updatedHabitaciones = snapshot.docs.map(async (doc) => {
          const data = doc.data();
          const tipoHabitacionRef = data.tipoHabitacion;
          const tipoHabitacionDoc = await getDoc(tipoHabitacionRef);
          const tipoHabitacion = tipoHabitacionDoc.data().nombre;

          return {
            id: doc.id,
            uid: doc.id,
            numeroHabitacion: data.numeroHabitacion,
            estado: data.estado,
            tipoHabitacion: tipoHabitacion,
            tipoHabitacionUid: tipoHabitacionDoc.id,
            teloUid: teloDoc.id,
            reservaUid: data.reservaUid? data.reservaUid : null
          };
        });
        Promise.all(updatedHabitaciones).then((habArray) => {
          setHabitaciones(habArray);
        });
      });

      return () => unsubscribe();
    }
  }, [teloDoc]);

  return (
    <div className="w-full flex flex-col gap-5">
      <DataTable columns={columns} data={habitaciones} />
      <div className="w-full flex flex-row justify-center items-center">
        <ModalAgregarHab />
      </div>
    </div>
  );
}
