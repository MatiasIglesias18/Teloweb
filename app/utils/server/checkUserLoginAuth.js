import { auth as adminAuth, auth }  from "firebase-admin";
import { auth as clientAuth } from "@/firebase/config";
import { cookies } from "next/headers";
import { getAuth } from "firebase-admin/auth";
const checkUserLoginAuth = async (session, roles, db) => {
  if (!session) {
    return {
      error: true,
      errorMessage: "El usuario no está autenticado",
      statusCode: 401,
    };
  }

  const decodedClaims = await adminAuth()
    .verifySessionCookie(session, true)
    .catch((error) => {
      console.log(error);
      //Remove the value and expire the cookie
      const options = {
        name: "session",
        value: "",
        maxAge: -1,
      };
      cookies().set(options);
      return {
        error: true,
        errorMessage:
          "El usuario no se encuentra logueado o la sesión ha expirado",
        statusCode: 401,
      };
    });

  if (decodedClaims.error) {
    const options = {
      name: "session",
      value: "",
      maxAge: -1,
    };
    cookies().set(options);
    clientAuth.signOut();
    return {
      error: true,
      errorMessage:
        "El usuario no se encuentra logueado o la sesión ha expirado",
      statusCode: 401,
    };
  }
  const currentUser = await db.collection("users").doc(decodedClaims.uid).get();

  if (!currentUser.exists) {
    return {
      error: true,
      errorMessage: "El usuario no existe en la base de datos",
      statusCode: 404,
    };
  }

  if (!roles || !Array.isArray(roles) || roles.length === 0) {
    return {
      error: true,
      errorMessage: "Verificar el rol de la llamada",
      statusCode: 403,
    };
  }

  const userRole = currentUser.data().tipoUsuario;
  const hasPermission = roles.includes(userRole);

  if (!hasPermission) {
    return {
      error: true,
      errorMessage: "El usuario no tiene los permisos adecuados",
      statusCode: 403,
    };
  }

  return { error: false, user: currentUser, rol: userRole, statusCode: 200 };
};

export default checkUserLoginAuth;
