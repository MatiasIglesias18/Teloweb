import { getUserDoc } from "../manejoUser/getUserDoc";
import {getDoc } from "firebase/firestore";

export default async function getTeloFromUid(uid) {
    const userDoc = await getUserDoc(uid);
    const teloDocRef = userDoc.telo;
    const teloDoc = await getDoc(teloDocRef);
    if (teloDoc) {
        /*console.log(teloDoc.data());*/
        return teloDoc;
    } else {
        console.error("Hubo un error al obtener el doc telo");
        return undefined;
    }
}