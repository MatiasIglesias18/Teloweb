import firebase_app from "../config";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { db } from "../config";
import { doc, setDoc } from "firebase/firestore"; 

const auth = getAuth(firebase_app);

export default async function signUp(email, password, nombre, tipoUser) {
    let user = null,
        error = null,
        result = null,
        profile = null;
        
    try {
        user = await createUserWithEmailAndPassword(auth, email, password);
        profile = await user.updateProfile({
            displayName: nuevoNombre,
          });
        constCreaUserDoc = await setDoc(doc(db, "users", user.user.uid), {
            nombre: nombre,
            tipoUser: tipoUser
          });
          result = user;
          
    } catch (e) {
        error = e;
    }

    return { result, error };
}
