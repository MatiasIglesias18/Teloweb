import {
    doc,
    getDoc,
    writeBatch,
    query, where,
    collection
  } from "firebase/firestore";
  import { db } from "@/firebase/config";
  
  export default async function getReservaFromHabitacion(uid) {
    try {
        const reservasCollection = collection(db, "reservas");
        const queryReservas = query(
            reservasCollection,
            where("habitacionUid", "==", uid)
        )


      const reservaRef = doc(db, "reservas", uid);
      const reservaDoc = await getDoc(reservaRef);
      const habitacionRef = reservaDoc.data().habitacionRef;
      const habitacionDoc = await getDoc(habitacionRef);
  
      if (!habitacionDoc.exists() || !reservaDoc.exists()) {
        return { result: false, error: "La reserva o la habitación no existen" };
      }
  
      if (reservaDoc.data().estado !== 1) {
        return { result: false, error: "La reserva no se encuentra activa" };
      }
  
      const batch = writeBatch(db);
      // Agregar las operaciones al lote
      batch.update(habitacionRef, { estado: 1 }); // Actualiza el estado de la habitación
      batch.update(reservaRef, { estado: 0 }); // Actualiza el estado de la reserva a cancelada
  
      // Ejecutar el lote de operaciones
      await batch.commit();
  
      return { result: true };

    } catch (error) {
      console.error("Hubo un error al cancelar la reserva: ", error);
      return { result: false, error: error };
    }
  }
  