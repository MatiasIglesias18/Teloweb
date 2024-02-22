import { auth, firestore } from "firebase-admin";
import { customInitApp } from "../../../firebase/admin/firebase-admin-config.js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import checkUserLoginAuth from "../../utils/server/checkUserLoginAuth.js";

// Init the Firebase SDK every time the server is called
const app = customInitApp();
const db = firestore();

/*Crea usuario Operador*/
export async function POST(request, response) {
  const session = cookies().get("session")?.value || "";
  const res = await request.json();
  const { email, passwd } = res;

  const userCheckResult = await checkUserLoginAuth(session, ["admin"], db);

  if (userCheckResult.error) {
    return NextResponse.json(
      { error: userDoc.error },
      { status: userDoc.statusCode }
    );
  }

  // Validación de email, passwd y nombreTelo
  if (typeof email !== "string" || email.trim() === "") {
    return NextResponse.json(
      { error: "El email debe ser una cadena no vacía" },
      { status: 400 }
    );
  }

  if (typeof passwd !== "string" || passwd.trim() === "" || passwd.length < 6) {
    return NextResponse.json(
      {
        error:
          "La contraseña debe ser una cadena no vacía y tener al menos 6 caracteres",
      },
      { status: 400 }
    );
  }

  // Validar que el email no exista en la base de datos
  const userDoc = await db
    .collection("users")
    .where("email", "==", email)
    .get();

  if (!userDoc.empty) {
    return NextResponse.json(
      { error: "El email ya existe en la base de datos" },
      { status: 400 }
    );
  }

  try {
    //Crea el usuario Operador
    const user = await auth().createUser({
      email: email,
      emailVerified: false,
      password: passwd,
      displayName: email,
      disabled: true,
    });

    //Crea usuario en la base de datos
    await db
      .collection("users")
      .doc(user.uid)
      .set({
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        deshabilitado: user.disabled,
        tipoUsuario: "operador",
      });

    return NextResponse.json(
      { result: `Usuario creado con uid = ${user.uid}` },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
