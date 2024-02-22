import { auth } from "firebase-admin";
import { customInitApp } from "../../../firebase/admin/firebase-admin-config.js";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";

// Init the Firebase SDK every time the server is called
customInitApp();

/*Login crea cookie*/
export async function POST(request, response) {
  const authorization = headers().get("Authorization");
  if (authorization?.startsWith("Bearer ")) {
    const idToken = authorization.split("Bearer ")[1];
    const decodedToken = await auth().verifyIdToken(idToken);
    
    if (decodedToken) {

      //Generate session cookie
      const expiresIn = 60 * 60 * 24 * 5 * 1000;
      const sessionCookie = await auth().createSessionCookie(idToken, {
        expiresIn,
      });
      const options = {
        name: "session",
        value: sessionCookie,
        maxAge: expiresIn,
        httpOnly: true,
        secure: true,
      };

      //Add the cookie to the browser
      cookies().set(options);
    } else {
      return NextResponse.json({error: true}, { status: 200 });
    }
  }

  return NextResponse.json({error: false}, { status: 200 });
}

/*Ya está logueado ?*/
export async function GET(request) {
  const session = cookies().get("session")?.value || "";

  //Validate if the cookie exist in the request
  if (!session) {
    return NextResponse.json({ isLogged: false }, { status: 401 });
  }

  //Use Firebase Admin to validate the session cookie
  const decodedClaims = await auth().verifySessionCookie(session, true);


  if (decodedClaims.error) {
    return NextResponse.json({ isLogged: false }, { status: 401 });
  }

  return NextResponse.json({ isLogged: true }, { status: 200 });
}