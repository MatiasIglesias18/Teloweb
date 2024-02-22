import { addDoc, collection, doc, query, where, getDocs } from "firebase/firestore";
import {db } from "@/firebase/config"
export default async function crearHabitacion(
  uidTelo,
  numeroHabitacion,
  tipoHabitacionUid
) {
  try {
    const teloDocRef = doc(db, "telos", uidTelo);
    const habitacionesCollection = collection(teloDocRef, "habitaciones");
    const tipoHabitacionRef = doc(db, "telos", uidTelo, "tiposHabitacion", tipoHabitacionUid);
    const nuevaHabitacion = {
      numeroHabitacion: numeroHabitacion,
      tipoHabitacion: tipoHabitacionRef,
      tipoHabitacionUid: tipoHabitacionRef.id, // Debes proporcionar una referencia o un campo que identifique el tipo de habitación.
      estado: 0,
    };
    
    const queryHabitaciones =  query(habitacionesCollection, where("numeroHabitacion", "==", numeroHabitacion));
    const habitacionesSnapshots = await getDocs(queryHabitaciones);
    if (!habitacionesSnapshots.empty) {
      return {result: false, error: "El número de habitación debe ser único"};
    }

    const docRef = await addDoc(habitacionesCollection, nuevaHabitacion);

    // docRef.id contiene el ID del nuevo documento de habitación creado.
    return {result: docRef.id, error: false};
  } catch (error) {
    return {result: false, error: error};
  }
}
