import { deleteDoc, doc, getDoc, writeBatch } from "firebase/firestore";
import { db } from "@/firebase/config";

export default async function eliminarReserva(uid) {
  try {
    const reservaRef = doc(db, "reservas", uid);
    const reservaDoc = await getDoc(reservaRef);

    if (!reservaDoc.exists()) {
      return [, "La reserva no existe"];
    }

    if (reservaDoc.data().estado !== 2 && reservaDoc.data().estado !== 0) {
      return [
        ,
        "La reserva solo puede ser eliminada si esta completada o vencida",
      ];
    }

    await deleteDoc(reservaRef);

    return [true, null];

  } catch (error) {
    return [, "Hubo un error al eliminar la reserva " + error];
  }
}
