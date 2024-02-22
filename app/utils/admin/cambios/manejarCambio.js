export const manejarCambio = async (cambioUid, estado) => {
  if (!cambioUid || !estado) {
    return { error: true };
  }
  if (estado !== "0" && estado !== "1" && estado !== "-1") {
    return { error: true };
  }

  //Aprobar cambio
  if (estado === "1") {
    const result = await fetch("/api/cambio-datos", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cambioUid: cambioUid,
        action: "aprobar",
      }),
    });

    if (result.status !== 200) {
      return { error: "Error en el fetch" };
    }
    const resultJson = await result.json();
    if (resultJson.error) {
      return { error: resultJson.error };
    }

    return { error: false, result: resultJson.result };
  }

  //Rechazar cambio
  if (estado === "0") {
    const result = await fetch("/api/cambio-datos", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cambioUid: cambioUid,
        action: "rechazar",
      }),
    });

    if (result.status !== 200) {
      return { error: "Error en el fetch" };
    }
    const resultJson = await result.json();
    if (resultJson.error) {
      return { error: resultJson.error };
    }

    return { error: false, result: resultJson.result };
  }

  //eliminar cambio
  if (estado === "-1") {
    const result = await fetch(`/api/cambio-datos`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cambioUid: cambioUid,
      }),
    });

    if (result.status !== 200) {
      return { error: "Error en el fetch" };
    }
    const resultJson = await result.json();
    if (resultJson.error) {
      return { error: resultJson.error };
    }

    return { error: false, result: resultJson.result };
  }
};
