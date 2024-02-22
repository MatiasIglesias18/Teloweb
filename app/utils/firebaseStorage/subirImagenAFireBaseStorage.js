import { getDownloadURL } from "firebase/storage";
import { ref, uploadBytes } from "firebase/storage";

// Función para subir una imagen a Firebase Storage
const subirImagenAFireBaseStorage = async (storage, file, ruta) => {
  //Valida que el archivo exista
  if (!file) {
    console.error("No se ha seleccionado ningún archivo.");
    return [, "No se ha seleccionado ningún archivo."];
  }
  //Valida que file sea una imagen
  if (!file.type.startsWith("image/")) {
    console.error("El archivo seleccionado no es una imagen.");
    return [, "El archivo seleccionado no es una imagen."];
  }
  //Valida que el archivo no supere los 5 MB
  if (file.size > 5 * 1024 * 1024) {
    console.error("El archivo es demasiado grande.");
    return [, "El archivo es demasiado grande."];
  }

  //Se asegura de que ruta no sea una cadena vacía
  if (ruta === "") {
    console.error("La ruta no puede estar vacía.");
    return [, "La ruta no puede estar vacía."];
  }

  //Se asegura de que ruta termine con un '/'
  if (!ruta.endsWith("/")) {
    ruta += "/";
  }

  try {
    const storageRef = ref(storage, ruta + file.name);
    const uploadResult = await uploadBytes(storageRef, file);
   
    //Devuelvo la ref
    return [uploadResult.ref, null];

  } catch (error) {
    console.error("Error al subir la imagen a Firebase Storage:", error);
    // Maneja el error apropiadamente
    return [, "Error al subir la imagen a Firebase Storage."];
  }
};

export default subirImagenAFireBaseStorage;
