import { firestore } from "firebase-admin";
import { customInitApp } from "../../../firebase/admin/firebase-admin-config.js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import checkUserLoginAuth from "../../utils/server/checkUserLoginAuth.js";
import tipoHabitacion from "@/app/tipos/tipoHabitacion.js";

// Init the Firebase SDK every time the server is called
const app = customInitApp();
const db = firestore();

//Crear telo
export async function POST(request, response) {
  const res = await request.json();
  const { teloNombre, teloDescripcion, teloBarrio, teloDireccion, userUid } = res;
  const session = cookies().get("session")?.value || null;
  const userCheckResult = await checkUserLoginAuth(
    session,
    ["operador", "admin"],
    db
  );
  if (userCheckResult.error) {
    console.log(userCheckResult.error);
    return NextResponse.json(
      { error: userCheckResult.error },
      { status: userCheckResult.statusCode }
    );
  }

  const userRef = db.doc("users/" + userUid);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    return NextResponse.json(
      { error: "El usuario no existe en la base de datos" },
      { status: 404 }
    );
  }

  // Verifica que no exista un telo con el mismo nombre en la base de datos
  const teloNameAvailable = await isTeloNameAvailable(teloNombre);
  if (!teloNameAvailable) {
    return NextResponse.json(
      { error: "Ya existe un telo con el mismo nombre" },
      { status: 400 }
    );
  }

  //Crea el Telo
  const teloRef = await createTelo(teloNombre, teloDireccion, teloBarrio, teloDescripcion, userRef);
  return NextResponse.json({ result: "exito" }, { status: 200 });
}

const createTiposHabitacion = async (teloRef) => {
  const ratingsRef = teloRef.collection("ratings");
  const habitacionesRef = teloRef.collection("habitaciones");
  const tiposHabitacionRef = teloRef.collection("tiposHabitacion");

  // Crea el primer tipo de habitación
  const basica = new tipoHabitacion(
    "basica",
    "Habitacion Básica",
    "Habitación Básica",
    100
  );
  const superior = new tipoHabitacion(
    "superior",
    "Habitacion Superior",
    "Habitación Superior",
    200
  );
  const premium = new tipoHabitacion(
    "premium",
    "Habitacion Premium",
    "Habitación Premium",
    300
  );
  const top = new tipoHabitacion(
    "top",
    "Habitacion TOP",
    "Habitación TOP",
    400
  );

  await tiposHabitacionRef
    .doc("basica")
    .set(JSON.parse(JSON.stringify(basica)));
  await tiposHabitacionRef
    .doc("superior")
    .set(JSON.parse(JSON.stringify(superior)));
  await tiposHabitacionRef
    .doc("premium")
    .set(JSON.parse(JSON.stringify(premium)));
  await tiposHabitacionRef.doc("top").set(JSON.parse(JSON.stringify(top)));

  await habitacionesRef.doc().set({
    estado: 0,
    numeroHabitacion: "1A",
    tipoHabitacion: tiposHabitacionRef.doc("basica"),
  });
};

//Verifica que no exista un telo con el mismo nombre en la base de datos
const isTeloNameAvailable = async (teloNombre) => {
  const teloSnapshot = await db
    .collection("telos")
    .where("nombre", "==", teloNombre)
    .get();
  return teloSnapshot.empty;
};

const createTelo = async (teloNombre, teloDireccion, teloBarrio, teloDescripcion, userRef) => {
  //Crea el telo
  const teloRef = db.collection("telos").doc();

  
  //Crea el telo
  await teloRef.set({
    publicado: false,
    email: "",
    telefono: "",
    barrio: teloBarrio,
    uid: teloRef.id,
    nombre: teloNombre,
    descripcion: teloDescripcion,
    direccion: teloDireccion,
    fechaCreacion: new Date(),
    geopoint: {longitud: 0, latitud: 0},
    habilitado: false,
    habitacionesDisponibles: 0,
    habitacionesReservadas: 0,
    habitacionesTotales: 0,
    operador: userRef,
    operadorUid: userRef.id,
    ratingPromedio: 3.0,
    servicios: [],
    imagenes: [],
  });

  //Crea tipos dentro de tiposHabitacion
  await createTiposHabitacion(teloRef);
  return teloRef;
};
