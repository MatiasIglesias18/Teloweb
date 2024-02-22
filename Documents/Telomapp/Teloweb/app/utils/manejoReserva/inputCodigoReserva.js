import {
  collection,
  query,
  where,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/firebase/config";

export default async function inputCodigoReserva(codigoReserva) {
  try {
    const ReservasCollection = collection(db, "reservas");
    const ReservasCollectionQuery = query(
      ReservasCollection,
      where("codigo", "==", codigoReserva),
      where("estado", "==", 1)
    );
    const snapshotReservas = await getDocs(ReservasCollectionQuery);

    if (!snapshotReservas.empty) {
      const batch = writeBatch(db);
      const habitacionRef = snapshotReservas.docs[0].data().habitacionRef;
      const reservaRef = snapshotReservas.docs[0].ref;

      // Agregar las operaciones al lote
      batch.update(habitacionRef, { estado: 3 });
      batch.update(reservaRef, { estado: 2 });

      // Ejecutar el lote de operaciones
      await batch.commit();

      return { result: true, reservaID: snapshotReservas.docs[0].id };
    }

    return {
      result: false,
      error: "Codigo incorrecto o no se encontró la reserva",
    };
  } catch (error) {
    console.error("Hubo un error al activar la reserva: ", error);
    return { result: false, error: error };
    /*throw error;*/
  }
}