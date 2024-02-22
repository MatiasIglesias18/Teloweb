'use client'
import { db } from "@/firebase/config";
import { doc, getDoc } from "firebase/firestore";
export async function getUserDoc(uid) {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
        /*console.log(userSnap.data());*/
        return userSnap.data();
    } else {
        console.log("no existe el user");
        return undefined;
    }
}