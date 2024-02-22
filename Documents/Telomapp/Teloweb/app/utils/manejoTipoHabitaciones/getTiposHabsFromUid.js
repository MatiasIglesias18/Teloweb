import getTeloFromUid from "../manejoTelos/getTeloFromUid";
import { collection, getDocs } from "firebase/firestore";

export default async function getTiposHabsFromUid(uid) {
  const arrayTiposHabitaciones = [];
  const teloRef = await getTeloFromUid(uid);
  const tiposHabitacionRef = collection(teloRef.ref, "tiposHabitacion");
  const tiposHabitacionesSnapShot = await getDocs(tiposHabitacionRef);
  if (tiposHabitacionesSnapShot) {
    tiposHabitacionesSnapShot.forEach((tipoHab) => {
      arrayTiposHabitaciones.push(tipoHab);
      /*console.log(tipoHab.data());*/
    });
    return arrayTiposHabitaciones;
  } else {
    console.error("Hubo un error al recuperar tipos de habitaciones");
    return undefined;
  }
}
