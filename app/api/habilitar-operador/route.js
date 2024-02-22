import { firestore, auth } from "firebase-admin";
import { customInitApp } from "../../../firebase/admin/firebase-admin-config.js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import checkUserLoginAuth from "../../utils/server/checkUserLoginAuth.js";

// Init the Firebase SDK every time the server is called
const app = customInitApp();
const db = firestore();

export async function POST(request, response) {
  const res = await request.json();
  const { userUid, disabled } = res;
  const session = cookies().get("session")?.value || null;

  const userCheckResult = await checkUserLoginAuth(session, ["admin"], db);
  if (userCheckResult.error) {
    console.log(userCheckResult.error);
    return NextResponse.json(
      { error: userCheckResult.error },
      { status: userCheckResult.statusCode }
    );
  }

  const userRef = db.doc("users/" + userUid);

  //Actualiza auth del usuario a deshabilitado
  try {
    await auth().updateUser(userUid, {
      disabled: disabled,
    });
    await userRef.update({ deshabilitado: disabled });

    //Deshabilita todos los telos del usuario solo si se esta deshabilitando usuario. Si se habilita usuario, no se hacen cambios en los telos.
    if (disabled === true) {
      const queryTelo = await db
        .collection("telos")
        .where("operadorUid", "==", userUid)
        .get();

      if (!queryTelo.empty) {
        const queryTeloUpdatePromises = [];
        queryTelo.docs.map((telo) => {
          queryTeloUpdatePromises.push(
            telo.ref.update({
              habilitado: false,
            })
          );
        });
        await Promise.all(queryTeloUpdatePromises);
      }
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ error: false }, { status: 200 });
}
