import getTeloFromUid from "../manejoTelos/getTeloFromUid";
import { collection, getDocs, query, where } from "firebase/firestore";

export default async function getTipoHabFromUidName(uid, nombre) {
  const teloRef = await getTeloFromUid(uid);
  const tiposHabitacionCol = collection(teloRef.ref, "tiposHabitacion");
  // Crea una consulta para buscar el documento con el campo "nombre" igual al parámetro "nombre"
  const consulta = query(tiposHabitacionCol, where("nombre", "==", nombre));

  const tipoHabitacionSnapshots = await getDocs(consulta);
  if (!tipoHabitacionSnapshots.empty) {
    return tipoHabitacionSnapshots.docs[0];
  } else {
    console.error("Hubo un error al recuperar tipo de habitacion");
    return undefined;
  }
}
