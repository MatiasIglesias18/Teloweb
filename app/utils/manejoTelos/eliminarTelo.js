import {
  collection,
  getDocs,
  deleteDoc,
  query,
  where,
  doc,
} from "firebase/firestore";
import { db } from "@/firebase/config";

export const eliminarTelo = async (teloUid) => {
  const teloRef = doc(db, "telos", teloUid);
  try {
    // Elimina el telo y sus subcolecciones

    await eliminarDocumentoYSubcolecciones(teloRef);

    // Elimina todas las reservas que contengan el campo uidTelo = teloUid
    const reservasQuery = query(
      collection(db, "reservas"),
      where("teloUid", "==", teloUid)
    );

    const reservasQuerySnapshot = await getDocs(reservasQuery);

    if (!reservasQuerySnapshot.empty) {
      const deletePromises = reservasQuerySnapshot.docs.map(async (doc) => {
        await deleteDoc(doc.ref);
      });
      await Promise.all(deletePromises);
    }

    //Eliminar todos los cambios en "cambios" que contengan el uidTelo = teloUid
    const cambiosQuery = query(
      collection(db, "cambios"),
      where("teloUid", "==", teloUid)
    );

    const cambiosQuerySnapshot = await getDocs(cambiosQuery);

    if (!cambiosQuerySnapshot.empty) {
      const deletePromises = cambiosQuerySnapshot.docs.map(async (doc) => {
        await deleteDoc(doc.ref);
      });
      await Promise.all(deletePromises);
    }

    const querySnapshot = await getDocs(reservasQuery);

    if (!querySnapshot.empty) {
      const deletePromises = querySnapshot.docs.map(async (doc) => {
        await deleteDoc(doc.ref);
      });
      await Promise.all(deletePromises);
    }

    return ["exito en eliminacion de telo", null];
  } catch (error) {
    console.error(error);
    return [null, error];
  }
};

// Función para eliminar recursivamente documentos de una subcolección
const eliminarSubcolecciones = async (coleccionRef) => {
  const querySnapshot = await getDocs(coleccionRef);

  if (!querySnapshot.empty) {
    querySnapshot.forEach(async (doc) => {
      await eliminarSubcolecciones(
        collection(coleccionRef, doc.id, "subcoleccion")
      );
      await deleteDoc(doc.ref);
    });
  }
};

// Función para eliminar un documento y sus subcolecciones recursivamente
const eliminarDocumentoYSubcolecciones = async (docRef) => {
  const subcoleccionHabitacionesRef = collection(docRef, "habitaciones");
  const subcolleccionReviewsRef = collection(docRef, "reviews");
  const subcoleccionTiposHabitacionRef = collection(docRef, "tiposHabitacion");

  await Promise.all([
    eliminarSubcolecciones(subcoleccionHabitacionesRef),
    eliminarSubcolecciones(subcolleccionReviewsRef),
    eliminarSubcolecciones(subcoleccionTiposHabitacionRef),
  ]);

  await deleteDoc(docRef);
};
