import { auth, firestore, storage } from "firebase-admin";
import { customInitApp } from "../../../firebase/admin/firebase-admin-config.js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import checkUserLoginAuth from "../../utils/server/checkUserLoginAuth.js";

// Inicializa la aplicación Firebase solo una vez
const app = customInitApp();
const db = firestore();
const bucket = storage().bucket();

/**
 * Recursively deletes a folder and its contents.
 *
 * @param {string} rutaCarpeta - The path of the folder to be deleted.
 * @return {Promise<void>} - A Promise that resolves when the folder and its contents are deleted successfully.
 */
async function eliminarCarpetaRecursiva(rutaCarpeta) {
  try {
    //Verificar que exista la carpeta
    const folderExists = await bucket.file(rutaCarpeta).exists();

    if (!folderExists[0]) {
      return;
    }
    const [files] = await bucket.getFiles({ prefix: rutaCarpeta });

    await Promise.all(
      files.map(async (file) => {
        if (file.isDirectory()) {
          await eliminarCarpetaRecursiva(file.name);
        } else {
          await file.delete();
        }
      })
    );

    // Eliminar la carpeta después de eliminar su contenido
    const carpeta = bucket.file(rutaCarpeta);
    await carpeta.delete();
    console.log("Carpeta y contenido eliminados correctamente.");
    return ["Exito", null]
  } catch (error) {
    console.error("Error al eliminar la carpeta y contenido:", error);
    return [, "Error al eliminar la carpeta y contenido."]
  }
}

const SUBCOLECCIONES = ["tiposHabitacion", "ratings", "habitaciones"];

/**
 * Elimina una subcolección y sus documentos.
 *
 * @param {firestore.CollectionReference} subcoleccionRef
 * @returns {Promise<boolean>} True si se eliminaron correctamente, False en caso de error.
 */
async function eliminarSubcoleccion(subcoleccionRef) {
  try {
    const querySnapshot = await subcoleccionRef.get();
    querySnapshot.docs.forEach(async (doc) => {
      await doc.ref.delete();
      console.log("Documento de subcolección eliminado con éxito.");
    });
    return true;
  } catch (error) {
    console.error("Error al eliminar la subcolección:", error);
    return false;
  }
}

/**
 * Elimina un Telo y sus subcolecciones.
 *
 * @param {firestore.DocumentReference} teloRef
 * @returns {Promise<boolean>} True si se eliminaron correctamente, False en caso de error.
 */
async function eliminarTelo(teloRef) {
  if (!teloRef) {
    console.error("No se pudo encontrar teloRef.");
    return false;
  }

  //Eliminamos carpetas en bucket recurivas del telo
  const [success, error] = await eliminarCarpetaRecursiva("telos/" + teloRef.id);
  if (error) {
    console.error(error);
  }

  const promesasEliminacion = SUBCOLECCIONES.map(async (subcoleccion) => {
    const subcoleccionRef = teloRef.collection(subcoleccion);
    return eliminarSubcoleccion(subcoleccionRef);
  });

  const resultadosEliminacion = await Promise.all(promesasEliminacion);
  const eliminacionSubcoleccionesExitosa = resultadosEliminacion.every(
    (eliminado) => eliminado
  );

  if (eliminacionSubcoleccionesExitosa) {
    await teloRef.delete();
    console.log("Telo eliminado con éxito.");
    return true;
  } else {
    console.error("Error al eliminar el Telo.");
    return false;
  }
}

/**
 * Controlador de la solicitud POST para eliminar un usuario operador y sus datos asociados.
 */
export async function POST(request) {
  const session = cookies().get("session")?.value || "";
  const res = await request.json();
  const { uid } = res;

  const userCheckResult = await checkUserLoginAuth(session, ["admin"], db);

  if (userCheckResult.error) {
    console.log(userCheckResult.error);
    return NextResponse.json(
      { error: userCheckResult.error },
      { status: userCheckResult.statusCode }
    );
  }

  const userDocRef = db.collection("users").doc(uid);

  try {
    //Eliminamos todas las reservas con el uid del operador
    const queryReservas = await db
      .collection("reservas")
      .where("operadorUid", "==", uid)
      .get();

    if (!queryReservas.empty) {
      const deleteReservaPromises = [];
      queryReservas.forEach((reserva) => {
        deleteReservaPromises.push(reserva.ref.delete());
      });
      await Promise.all(deleteReservaPromises);
    }

    //Eliminamos todos los telos con el uid del operador
    const queryTelos = await db
      .collection("telos")
      .where("operadorUid", "==", uid)
      .get();

    if (!queryTelos.empty) {
      const deleteTelosPromises = [];
      queryTelos.forEach(async (doc) => {
        deleteTelosPromises.push(eliminarTelo(doc.ref));
      });
      await Promise.all(deleteTelosPromises);
    }

    //Eliminamos carpeta de usuario en firestore
    await eliminarCarpetaRecursiva(`operadores/${uid}`);

    //Eliminamos todos las solicitudes de cambios en "cambios" con el uid del operador
    const queryCambios = await db.collection("cambios").where("operadorUid", "==", uid).get();

    if (!queryCambios.empty) {
      const deleteCambiosPromises = [];
      queryCambios.forEach((cambio) => {
        deleteCambiosPromises.push(cambio.ref.delete());
      });
      await Promise.all(deleteCambiosPromises);
    }

    // Elimina el usuario de la base de datos
    await userDocRef.delete();

    // Elimina el usuario de firebase Auth
    await auth().deleteUser(uid);

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error("Error al eliminar el operador:", error);
    return NextResponse.json(
      { error: "Error al eliminar el operador" },
      { status: 400 }
    );
  }
}
