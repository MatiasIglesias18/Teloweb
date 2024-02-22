import getTeloFromUid from "../manejoTelos/getTeloFromUid";
import {
  collection,
  getDocs,
  getDoc,
} from "firebase/firestore";

export default async function getHabitacionesFromUid(uid) {
  try {
    const arrayHabitaciones = [];
    const teloRef = await getTeloFromUid(uid);
    const habitacionesRef = collection(teloRef.ref, "habitaciones");

    // Ejecuta una consulta para obtener los tipos de habitaciones.
    const habitacionesSnapshot = await getDocs(habitacionesRef);

    for (const habitacion of habitacionesSnapshot.docs) {
      const tipoHabitacionDoc = await getDoc(habitacion.data().tipoHabitacion);
      const tipoHabitacion = tipoHabitacionDoc.data().nombre;
      arrayHabitaciones.push({
        id: habitacion.id,
        numeroHabitacion: habitacion.data().numeroHabitacion,
        estado: habitacion.data().estado,
        tipoHabitacion: tipoHabitacion,
      });
    }

    return arrayHabitaciones;
  } catch (error) {
    console.error("Hubo un error al recuperar las habitaciones:", error);
    throw error;
  }
}
