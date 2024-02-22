const solicitarAlta = async (values, uidTelo, uidDoc) => {
  try {
    const response = await fetch("/api/cambio-datos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        docUid: uidDoc,
        values: values,
        action: "update",
        type: "altaTelo",
        teloUid: uidTelo,
      }),
    });
    return ["Exito en solicitud de alta", null];
  } catch (error) {
    console.log(error.code);
    return [, error];
  }
};

export default solicitarAlta;
