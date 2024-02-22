export const deshabilitarOperador = async (userUid) => {
    const result = await fetch(`/api/habilitar-operador`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        userUid: userUid,
        disabled: true,
      }),
    });
    const resultJson = await result.json();
    if (resultJson.error) {
      return { error: true };
    }
    return { error: false };
  };
  