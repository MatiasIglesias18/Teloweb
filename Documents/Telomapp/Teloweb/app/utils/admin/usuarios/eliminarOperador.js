import { db, } from "@/firebase/config";
import { doc, getDoc } from "firebase/firestore";

const eliminarOperador = async (uid) => {
  if (!uid) {
    return [, `Todos los campos son obligatorios`];
  }

  //Verifica que operador existe
  const operadorRef = doc(db, "users", uid);
  const operadorDoc = await getDoc(operadorRef);
  if (!operadorDoc.exists()) {
    console.error("El operador no existe");
    return [, `El operador no existe`];
  }

  const response = await fetch("/api/eliminar-operador", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      uid: uid,
    }),
  });

  if (response.status !== 200) {
    console.error("Error al eliminar el operador");
    return [, `Error al eliminar el operador`];
  }

  const responseJson = await response.json();
  if (responseJson.success) {
    return ["Operador eliminado exitosamente", null];
  }
};

export default eliminarOperador;
