import { doc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

export default async function eliminarHabitacion(uidHabitacion, teloUid) {
  if (!uidHabitacion || !teloUid) {
    return {
      error: `Todos los campos son obligatorios: ${uidHabitacion}, ${teloUid}`,
    };
  }

  const habitacionDocRef = doc(
    db,
    "/telos/" + teloUid + "/habitaciones/" + uidHabitacion
  );


  try {
    const habitacionDoc = await getDoc(habitacionDocRef); // Actualiza el estado de la habitacionDoc
    const habitacion = habitacionDoc.data();
    if (habitacion.estado !== 0 && habitacion.estado !== 1) {
      return { error: "El estado debe ser 0 o 1" };
    }
    await deleteDoc(habitacionDocRef);
  } catch (error) {
    return { error: error };
  }
  return { success: habitacionDocRef.id };
}
