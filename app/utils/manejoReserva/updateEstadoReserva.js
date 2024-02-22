import { updateDoc, doc } from "firebase/firestore";
import { db } from "@/firebase/config";

export default async function updateEstadReserva(
  uidReserva,
  codeEstado
) {
  if (!uidReserva || (codeEstado === null || codeEstado === undefined) || isNaN(codeEstado)) {
    return {error: `Todos los campos son obligatorios: ${uidHabitacion}, ${codeEstado}`};
  }
  if (codeEstado !== 0 && codeEstado !== 1) {
    return {error: "El estado debe ser 0 o 1"};
  }
  try {
    const reservaRef = doc(db, 
      "/reservas", uidReserva);
    
    await updateDoc(reservaRef, { estado: codeEstado }); // Actualiza el estado de la habitacionDoc
  } catch (error) {
    
    return { error: error };
  }
  return { success: codeEstado };
}
