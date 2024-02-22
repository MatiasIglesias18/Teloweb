import { firestore } from "firebase-admin";
import { customInitApp } from "../../../firebase/admin/firebase-admin-config.js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import checkUserLoginAuth from "../../utils/server/checkUserLoginAuth.js";

// Init the Firebase SDK every time the server is called
const app = customInitApp();
const db = firestore();

export async function POST(request) {
  const session = cookies().get("session")?.value || "";
  const req = await request.json();
  const { roles } = req;
  const userCheckResult = await checkUserLoginAuth(session, roles, db);
  if (userCheckResult.error) {
    return NextResponse.json(
      { error: userCheckResult.error, mensaje: userCheckResult.errorMessage },
      { status: userCheckResult.statusCode }
    );
  }
  return NextResponse.json({error: userCheckResult.error, user: userCheckResult.user, rol: userCheckResult.rol}, { status: userCheckResult.statusCode });
}

