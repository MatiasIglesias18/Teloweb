import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getUserDoc } from "../manejoUser/getUserDoc";

export default async function crearTipoHabitacionUid(
  uid,
  nombreTipoHabitacion,
  numeroPubTipoHabitacion,
  descripcionTipoHabitacion,
  precioTipoHabitacion
) {
  try {
    const userDoc = await getUserDoc(uid);
    const teloDocRef = userDoc.telo;
    const tiposHabitacionCol = collection(teloDocRef, "tipoHabitaciones");
    const nuevoTipoHabitacion = {
      descripcion: descripcionTipoHabitacion,
      nombre: nombreTipoHabitacion,
      nombrePublico: numeroPubTipoHabitacion,
      precio: precioTipoHabitacion,
    };

    const queryTipoHabitaciones = query(
      tiposHabitacionCol,
      where("nombre", "==", nombreTipoHabitacion)
    );
    const tipoHabitacionesSnapshots = await getDocs(queryTipoHabitaciones);
    if (!tipoHabitacionesSnapshots.empty) {
      console.error("El tipo de habitación ya existe");
      return false;
    }

    const docRef = await addDoc(tiposHabitacionCol, nuevoTipoHabitacion);

    // docRef.id contiene el ID del nuevo documento de habitación creado.
    return docRef.id;

  } catch (error) {
    console.error("Hubo un error al crear el tipo de habitación:", error);
    return false;
    /*throw error;*/
  }
}
