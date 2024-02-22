import { db } from "@/firebase/config";
import { doc, getDoc, updateDoc} from "firebase/firestore";
export const deshabilitarTelo = async (teloUid) => {
  if (!teloUid) {
    return [, "No se ha seleccionado ningún telo."];
  }

  const teloDocRef = doc(db, "telos", teloUid);
  const teloDoc = await getDoc(teloDocRef);

  if (!teloDoc.exists()) {
    return [, "El telo no existe."];
  }
  //actualizar el campo habilitado del telo a true
  try {
    updateDoc(teloDocRef, { habilitado: false });
    return ["El telo ha sido deshabilitado con éxito.", null];
  } catch (error) {
    console.log(error);
    return [, `Hubo un error al habilitar el telo.`];
  }
};
export default deshabilitarTelo;