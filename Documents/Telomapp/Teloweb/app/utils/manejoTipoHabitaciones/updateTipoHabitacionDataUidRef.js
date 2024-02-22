import getTeloFromUid from "../manejoTelos/getTeloFromUid";
import { collection, getDocs, query, where, updateDoc } from "firebase/firestore";

export default async function updateTipoHabitacionDataUidRef(uid, nombre, nuevoNombre, nombrePublico, descripcion, precio) {
  const teloRef = await getTeloFromUid(uid);
  const tiposHabitacionCol = collection(teloRef.ref, "tiposHabitacion");
  // Crea una consulta para buscar el documento con el campo "nombre" igual al parámetro "nombre"
  const consulta = query(tiposHabitacionCol, where("nombre", "==", nombre));

  const tipoHabitacionSnapshots = await getDocs(consulta);

  if (!tipoHabitacionSnapshots.empty) {
    const tipoHabitacionRef = tipoHabitacionSnapshots.docs[0].ref;
    // Objeto con los campos actualizados
    const datosActualizados = {
        nombre: nuevoNombre,
        nombrePublico,
        descripcion,
        precio,
      };
      // Aplicar los cambios al documento
    await updateDoc(tipoHabitacionRef, datosActualizados);
    console.log("Tipo de habitación actualizado exitosamente");
    return datosActualizados.nombre;
  } else {
    console.error("Hubo un error al recuperar tipo de habitacion");
    return undefined;
  }
}
