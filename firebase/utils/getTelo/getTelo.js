import { db } from "@/firebase/config";
import { getDoc, doc } from "firebase/firestore";

const getTelo = async (userId) => {
  const userDocRef = doc(db, "users", userId);
  const userDocSnapshot = await getDoc(userDocRef);
  if (userDocSnapshot.exists()) {
    const userData = userDocSnapshot.data();

    // Supongamos que un usuario tiene una referencia a su "telo" llamada "teloRef"
    const teloDocRef = userData.telo;
    const teloDocSnapshot = await getDoc(teloDocRef);

    if (teloDocSnapshot.exists()) {
      // Obtiene los datos del "telo"
      
      return teloDocSnapshot;
    }
  }

  // Si no se encuentra el usuario o no tiene un "telo" asociado, puedes devolver null o manejarlo de acuerdo a tus necesidades
  return null;
};

export default getTelo;
