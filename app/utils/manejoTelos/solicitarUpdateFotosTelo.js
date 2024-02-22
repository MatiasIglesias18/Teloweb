import { storage } from "@/firebase/config";
import { db } from "@/firebase/config";
import { auth } from "@/firebase/config";
import { addDoc, collection, getDoc } from "firebase/firestore";

import subirImagenAFireBaseStorage from "../firebaseStorage/subirImagenAFireBaseStorage";

const solicitarUpdateFotosTelo = async (teloRef, files) => {
  if (!teloRef) {
    return [, "No se ha seleccionado ningún telo."];
  }
  // Obtiene el uid del telo
  const teloUid = teloRef.id;
  const teloDoc = await getDoc(teloRef);

  if (!teloDoc.exists()) {
    return [, "El telo no existe."];
  }

  //valida files
  if (!files) {
    return [, "No se ha seleccionado ningún archivo."];
  }

  //valida que files sea un arreglo
  if (!Array.isArray(files)) {
    return [, "El archivo debe ser un arreglo."];
  }

  //valida que files no esté vacío
  if (files.length === 0) {
    return [, "El arreglo de archivos está vacío."];
  }

  //Loopea files y remueve todos los archivos que sean nulos, vacios o undefined
  const filteredFiles = files.filter(
    (file) => file !== null && file !== undefined && file !== ""
  );

  //valida que filteredFiles no esté vacío
  if (filteredFiles.length === 0) {
    return [, "El arreglo de archivos está vacío."];
  }

  //Construye la ruta de firestorage a la que se subirán las imagenes. La ruta es /telos/[teloUid]/fotos/pendientesAprobacion/
  const ruta = `telos/${teloUid}/fotos/pendientesAprobacion/`;

  //Sube los archivos a firestorage utilizando la funcion asincrona subirImagenAFireBaseStorage y obtiene un array de promesas
  const promesas = filteredFiles.map((file) =>
    subirImagenAFireBaseStorage(storage, file, ruta)
  );

  // Espera a que todas las promesas se resuelvan
  const resultados = await Promise.all(promesas);

  // Maneja los resultados de las promesas
  resultados.forEach((resultado) => {
    // Verifica si hay un error
    if (resultado[1]) {
      console.error(resultado[1]);
      return [, resultado[1]];
    } else {
      console.log(resultado[0]);
      return [resultado[0], null];
    }
  });

  //genero un array con las urls de las imagenes subidas
  const relativePaths = resultados.map((resultado) => resultado[0].fullPath);

  //Campos
  const campos = {
    imagenes: relativePaths,
  }

  // Crea un cambioDoc en Firestore en la colección "cambios"
  const cambioDocRef = await addDoc(collection(db, "cambios"), {
    estado: "pendiente",
    action: "update",
    type: "fotosTelo",
    campos: campos,
    creado: new Date(),
    docRef: teloRef,
    teloUid: teloUid,
    teloName: teloDoc.data().nombre,
    operadorEmail: auth.currentUser.email,
    operadorUid: auth.currentUser.uid,
    operadorName: auth.currentUser.displayName,
  });
  

  return [relativePaths, null];
};


export default solicitarUpdateFotosTelo