const solicitarUpdateDatosTipoHab = async (values, uidTelo, uidDoc) => {
  const response = await fetch("/api/cambio-datos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      docUid: uidDoc,
      values: values,
      action: "update",
      type: "tipoHab",
      teloUid: uidTelo,
    }),
  });
};

export default solicitarUpdateDatosTipoHab;
