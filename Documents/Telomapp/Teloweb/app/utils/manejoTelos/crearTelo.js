export async function crearTelo(values, userUid) {
  try {
    const response = await fetch("/api/telos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        teloNombre: values.teloNombre,
        teloBarrio: values.teloBarrio,
        teloDireccion: values.teloDireccion,
        teloDescripcion: values.teloDescripcion,
        userUid: userUid,
      }),
    });

    if (response.status === 200) {
      console.log("Telo creado con éxito");
      return { success: true };
    } else {
      console.log("Hubo un error al crear el telo");
      return { error: response };
    }
  } catch (error) {
    console.log(error.code);
    return { error: error };
  }
}
