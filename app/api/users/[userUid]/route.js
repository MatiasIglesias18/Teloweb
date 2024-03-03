import { customInitApp } from "../../../../firebase/admin/firebase-admin-config.js";
import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";
import checkUserLoginAuth from "../../../utils/server/checkUserLoginAuth.js";
import { auth, firestore } from "firebase-admin";

// Init the Firebase SDK every time the server is called
const app = customInitApp();
const db = firestore();

//Crear telo
export async function POST(request, response) {
  const res = await request.json();
  const { action } = res;

  //obtener userUid del last segmento de la url
  const url = request.nextUrl;
  const segments = url.pathname.split("/");
  const userUid = segments[segments.length - 1];
  
  const session = cookies().get("session")?.value || null;

  //Check user auth y privilegios de admin
  const userCheckResult = await checkUserLoginAuth(session, ["admin"], db);
  if (userCheckResult.error) {
    console.log(userCheckResult.error);
    return NextResponse.json(
      { error: userCheckResult.error },
      { status: userCheckResult.statusCode }
    );
  }

  //Check que parametros esten set
  if (!userUid || !action) {
    return NextResponse.json(
      {
        error: "Faltan campos obligatorios",
      },
      { status: 400 }
    );
  }

  //Check que el usuario exista en firebase Auth
  let user;
  try {
    user = await auth().getUser(userUid);
  } catch (error) {
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }

  if (!user) {
    return NextResponse.json(
      {
        error: "El usuario no existe",
      },
      { status: 404 }
    );
  }

  //accion cambiar passwd
  if (action === "changePasswd") {
    //Check que exista newPasswd en el body
    if (!res.newPasswd) {
      return NextResponse.json(
        {
          error: "Faltan campos obligatorios",
        },
        { status: 400 }
      );
    }

    const newPasswd = res.newPasswd;

    try {
      //cambiar el passwd del user
      const user = await auth().updateUser(userUid, {
        password: newPasswd,
      });
      return NextResponse.json(
        { message: "Contraseña cambiada" },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ error: "Acción no válida" }, { status: 400 });
}
