import { auth, firestore, storage } from "firebase-admin";
import { customInitApp } from "../../../firebase/admin/firebase-admin-config.js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import checkUserLoginAuth from "../../utils/server/checkUserLoginAuth.js";

// Init the Firebase SDK every time the server is called
const app = customInitApp();
const db = firestore();
const bucket = storage().bucket();

export async function POST(request) {
  const session = cookies().get("session")?.value || null;
  const res = await request.json();
  const { values, docUid, action, type, teloUid } = res;

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

  const userUid = userCheckResult.user.data().uid;

  //Valida que existan todos los campos del res
  if (!values || !docUid || !teloUid || !action || !type) {
    return NextResponse.json(
      { error: "Faltan campos por rellenar" },
      { status: 400 }
    );
  }

  //Valida que type sea igual a "telo" o "tipoHab"
  if (type !== "telo" && type !== "tipoHab" && type !== "altaTelo") {
    return NextResponse.json(
      {
        error: "El campo type debe ser igual a 'telo', 'tipoHab' o 'altaTelo' ",
      },
      { status: 400 }
    );
  }

  //Valida que dentro de la coleccion /telos exista un documento con el uid = docUid
  const teloRef = db.collection("telos").doc(teloUid);
  const teloSnapshot = await teloRef.get();
  if (teloSnapshot.exists === false) {
    return NextResponse.json(
      { error: "El telo no existe en la base de datos" },
      { status: 404 }
    );
  }

  //Valida que dentro de la coleccion /cambios no exista un documento con el uid = docUid
  const cambiosRef = db.collection("cambios");
  const cambiosSnapshot = await cambiosRef
    .where("docUid", "==", docUid)
    .where("estado", "==", "pendiente")
    .where("type", "==", type)
    .get();

  if (!cambiosSnapshot.empty) {
    //actualizar ese doc en la coleccion /cambios con los nuevos values
    const cambioDocRef = db
      .collection("cambios")
      .doc(cambiosSnapshot.docs[0].id);
    await cambioDocRef.update({
      campos: { ...values },
      actualizadoEl: new Date(),
    });
    return NextResponse.json({ cambioUid: cambioDocRef.id }, { status: 200 });
  }

  if (type === "telo") {
    //Agrega un doc en la coleccion /cambios
    const cambiosRef = db.collection("cambios");
    const teloRef = db.collection("telos").doc(teloUid);
    const cambioRef = await cambiosRef.add({
      docUid: docUid,
      docRef: teloRef,
      teloUid: teloUid,
      campos: values,
      action: action,
      type: type,
      creado: new Date(),
      operadorUid: userUid,
      operadorEmail: userCheckResult.user.data().email,
      operadorName: userCheckResult.user.data().displayName,
      estado: "pendiente",
      teloName: teloSnapshot.data().nombre,
    });
    //devuelve respuesta ok con uid del cambio
    return NextResponse.json({ cambioUid: cambioRef.id }, { status: 200 });
  } else if (type === "tipoHab") {
    //Valida que dentro de /telos/teloUid/tiposHabitacion exista un documento con el uid = docUid
    const tipoHabitacionRef = db.collection(`telos/${teloUid}/tiposHabitacion`);
    //Intentamos recuperar el doc de la coleccion de tiposHabitacion con el uid = docUid
    const tipoHabitacionSnapshot = await tipoHabitacionRef.doc(docUid).get();
    if (tipoHabitacionSnapshot.exists === false) {
      return NextResponse.json(
        { error: "El tipo de habitacion no existe en la base de datos" },
        { status: 404 }
      );
    }
    //Si llegamos hasta aca significa que esta todo ok
    //Agrega un doc en la coleccion /cambios
    const cambiosRef = db.collection("cambios");
    const docRef = db
      .collection(`/telos/${teloUid}/tiposHabitacion`)
      .doc(docUid);
    const cambioRef = await cambiosRef.add({
      docUid: docUid,
      docRef: docRef,
      teloUid: teloUid,
      campos: values,
      action: action,
      type: type,
      creado: new Date(),
      operadorUid: userUid,
      operadorEmail: userCheckResult.user.data().email,
      operadorName: userCheckResult.user.data().displayName,
      estado: "pendiente",
      teloName: teloSnapshot.data().nombre,
    });
    //devuelve respuesta ok con uid del cambio
    return NextResponse.json({ cambioUid: cambioRef.id }, { status: 200 });
  } else if (type === "altaTelo") {
    //Agrega un doc en la coleccion /cambios
    const cambiosRef = db.collection("cambios");
    const teloRef = db.collection("telos").doc(teloUid);
    const cambioRef = await cambiosRef.add({
      docUid: docUid,
      docRef: teloRef,
      teloUid: teloUid,
      campos: values,
      action: action,
      type: type,
      creado: new Date(),
      operadorUid: userUid,
      operadorEmail: userCheckResult.user.data().email,
      operadorName: userCheckResult.user.data().displayName,
      estado: "pendiente",
      teloName: teloSnapshot.data().nombre,
    });
    return NextResponse.json({ cambioUid: cambioRef.id }, { status: 200 });
  }

  //Devuelve respuesta de que hubo algun error
  return NextResponse.json({ error: "Error desconocido" }, { status: 500 });
}

//Esta ruta acepta peticiones PUT para cambiar el estado del cambio y aplicar los cambios
export async function PUT(request) {
  const session = cookies().get("session")?.value || null;
  const res = await request.json();
  const { cambioUid, action } = res;

  //chequear que si o si seamos admins utilizando userCheckResult
  const userCheckResult = await checkUserLoginAuth(session, ["admin"], db);

  if (userCheckResult.error) {
    console.log(userCheckResult.error);
    return NextResponse.json(
      { error: userCheckResult.error },
      { status: userCheckResult.statusCode }
    );
  }

  //Valida que todos los campos del res tengan valores
  if (!cambioUid || !action) {
    return NextResponse.json(
      { error: "Todos los campos son obligatorios" },
      { status: 400 }
    );
  }

  //Obtiene los campos del cambio
  const cambioRef = db.collection("cambios").doc(cambioUid);
  const cambioSnapshot = await cambioRef.get();

  if (!cambioSnapshot.exists) {
    return NextResponse.json({ error: "El cambio no existe" }, { status: 404 });
  }

  const cambio = cambioSnapshot.data();
  const docRef = cambio.docRef;
  const campos = cambio.campos;

  if (action === "aprobar") {
    const docSnapshot = await docRef.get();

    //Verificar que el documento
    if (!docSnapshot.exists) {
      return NextResponse.json(
        { error: "El documento no existe" },
        { status: 404 }
      );
    }

    // Verificar que campos no esté vacío
    if (Object.keys(campos).length === 0) {
      return NextResponse.json(
        { error: "No hay campos para aplicar cambios" },
        { status: 400 }
      );
    }

    //Aplicar cambios al telo a partir de los valores de cambio.campos
    //Cambia el estado del cambio a aprobado
    if (cambio.type == "fotosTelo") {
      // Eliminar Fotos dentro de bucket en ruta /telos/{teloUid}/fotos a partir de los valores de teloDoc.imagenes[]
      try {
        const teloDoc = await docRef.get();
        const teloUid = teloDoc.id;
        const teloData = teloDoc.data();
        const teloImagenes = teloData.imagenes;

        // Eliminar imágenes antiguas
        await Promise.all(
          teloImagenes.map(async (imagen) => {
            const imageRef = bucket.file(imagen);
            await imageRef.delete();
          })
        );

        // Crear imagenes nuevas
        const imagenesArray = [];
        for (let i = 0; i < cambio.campos.imagenes.length; i++) {
          const imagen = cambio.campos.imagenes[i];
          const imageRef = bucket.file(imagen);
          //Obtener extension de archivo
          const extension = imageRef.name.split(".").pop();
          // Mover imageRef a la ruta /telos/{teloUid}/fotos

          await imageRef.move(
            `telos/${teloUid}/fotos/imagen_${i}.${extension}`
          );

          const newImageRef = bucket.file(
            `telos/${teloUid}/fotos/imagen_${i}.${extension}`
          );

          // Almacena la imagenRef en un array
          imagenesArray.push(newImageRef.name);
        }

        //Actualiza el campo imagenes del telo
        await docRef.update({ imagenes: imagenesArray, imagenesActualizadasEl: new Date });

        await cambioRef.update({
          estado: "aprobado",
          campos: { imagenes: imagenesArray },
        });

        //Devuelve Respuesta ok
        return NextResponse.json(
          { result: "Cambio aprobado y realizado", error: false },
          { status: 200 }
        );
      } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    if (cambio.type == "fotosTipoHab") {
      // Eliminar Fotos dentro de bucket en ruta /telos/{teloUid}/tiposHabitacion/{tipoHabUid}/fotos a partir de los valores de teloDoc.imagenes[]
      try {
        const teloUid = cambio.teloUid;
        const tipoHabUid = docRef.id;
        const tipoHabDoc = await docRef.get();
        const tipoHabData = tipoHabDoc.data();
        const tipoHabImagenes = tipoHabData.imagenes;

        // Eliminar imágenes antiguas
        await Promise.all(
          tipoHabImagenes.map(async (imagen) => {
            const imageRef = bucket.file(imagen);
            await imageRef.delete();
          })
        );

        // Crear imagenes nuevas
        const imagenesArray = [];
        for (let i = 0; i < cambio.campos.imagenes.length; i++) {
          const imagen = cambio.campos.imagenes[i];
          const imageRef = bucket.file(imagen);
          //Obtener extension de archivo
          const extension = imageRef.name.split(".").pop();
          // Mover imageRef a la ruta /telos/{teloUid}/fotos
          await imageRef.move(
            `telos/${teloUid}/tiposHabitacion/${tipoHabUid}/fotos/imagen_${i}.${extension}`
          );
          const newImageRef = bucket.file(
            `telos/${teloUid}/tiposHabitacion/${tipoHabUid}/fotos/imagen_${i}.${extension}`
          );

          // Almacena la imagenRef en un array
          imagenesArray.push(newImageRef.name);
        }

        //Actualiza el campo imagenes del telo
        await docRef.update({ imagenes: imagenesArray, imagenesActualizadasEl: new Date  });

        await cambioRef.update({
          estado: "aprobado",
          campos: { imagenes: imagenesArray },
        });

        //Devuelve Respuesta ok
        return NextResponse.json(
          { result: "Cambio aprobado y realizado", error: false },
          { status: 200 }
        );
      } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    try {
      await docRef.update(campos);
      await cambioRef.update({
        estado: "aprobado",
      });
      //Devuelve respuesta ok
      return NextResponse.json(
        { result: "Cambio aprobado y realizado", error: false },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 200 });
    }
  }

  if (action === "rechazar") {
    // Cambiar el estado del cambio a "rechazado"
    try {
      await cambioRef.update({
        estado: "rechazado",
      });
      return NextResponse.json(
        { result: "El cambio ha sido rechazado correctamente" },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}

// Esta ruta acepta peticiones DELETE para eliminar una solicitud de cambio
export async function DELETE(request) {
  const session = cookies().get("session")?.value || null;
  const res = await request.json();
  const { cambioUid } = res;
  // chequear que si o si seamos admins utilizando userCheckResult
  const userCheckResult = await checkUserLoginAuth(session, ["admin"], db);

  if (userCheckResult.error) {
    console.log(userCheckResult.error);
    return NextResponse.json(
      { error: userCheckResult.error },
      { status: userCheckResult.statusCode }
    );
  }

  // Validar que el campo cambioUid tenga un valor
  if (!cambioUid) {
    return NextResponse.json(
      { error: "El campo 'cambioUid' es obligatorio" },
      { status: 400 }
    );
  }

  // Obtener el cambio por su UID
  const cambioRef = db.collection("cambios").doc(cambioUid);
  const cambioSnapshot = await cambioRef.get();

  if (!cambioSnapshot.exists) {
    return NextResponse.json(
      { error: "El cambio que intentas rechazar no existe" },
      { status: 404 }
    );
  }

  //Elimina el cambio
  try {
    await cambioRef.delete();
    //Devuelve respuesta ok
    return NextResponse.json(
      { result: "Cambio eliminado", error: false },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 200 });
  }
}
