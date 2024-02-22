
import { db } from "@/firebase/config";
import { collection, getDocs, query, where } from "firebase/firestore";
export default async function getTelos(user) {
  const telosRef = collection(db, "telos");

  //Buscar todos los telos cuyo campo operador coincida con el uid del usuario actual
  const telosQuery = query(telosRef, where("operadorUid", "==", user.uid));
  
  try {
    const telosSnapshot = await getDocs(telosQuery);
    if (telosSnapshot.empty) {
      console.log("No se encontraron telos");
      return [];
    }
    const arrayTelos = [];
    telosSnapshot.forEach((doc) => {
      arrayTelos.push(doc.data());
    });
    
    return arrayTelos;
  } catch {
    (error) => {
      console.error(error);
    };
  }
}
