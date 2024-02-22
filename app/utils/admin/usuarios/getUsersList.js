import { collection, getDocs, query, where } from "firebase/firestore";
import { firebase_app, db } from "@/firebase/config";

//obtiene una lista de usuarios a partir de los usuarios de la base de datos dentro de la coleccion "users" del tipo "operador"
const getUsersList = async () => {
  const usersRef = collection(db, "users");
  const querySnapshot = await getDocs(query(usersRef, where("tipoUsuario", "==", "operador")));

  const usersList = [];
  querySnapshot.forEach((doc) => {
    usersList.push(doc.data());
  });

  return usersList;
};

export default getUsersList;