import {getDoc, doc } from "firebase/firestore";
import { db } from "@/firebase/config"

export default async function getTeloDocFromUid(uid) {
    const teloDocRef = doc(db, "telos", uid);
    const teloDoc = await getDoc(teloDocRef);
    if (teloDoc.exists()) {
        return teloDoc;
    } else {
        console.error("Hubo un error al obtener el doc telo");
        return false;
    }
}