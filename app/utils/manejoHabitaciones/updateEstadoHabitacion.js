import { updateDoc, doc } from "firebase/firestore";
import { db } from "@/firebase/config";

export default async function updateEstadoHabitacion(
  uidHabitacion,
  codeEstado,
  teloUid
) {
  if (!uidHabitacion || (codeEstado === null || codeEstado === undefined) || isNaN(codeEstado) || !teloUid) {
    return {error: `Todos los campos son obligatorios: ${uidHabitacion}, ${codeEstado}, ${teloUid}`};
  }
  if (codeEstado !== 0 && codeEstado !== 1) {
    return {error: "El estado debe ser 0 o 1"};
  }
  try {
    const habitacionDoc = doc(db, 
      "/telos/" + teloUid + "/habitaciones/" + uidHabitacion
    );
    
    await updateDoc(habitacionDoc, { estado: codeEstado }); // Actualiza el estado de la habitacionDoc
  } catch (error) {
    
    return { error: error };
  }
  return { success: codeEstado };
}
