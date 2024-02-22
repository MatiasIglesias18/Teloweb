export const habilitarOperador = async (userUid) => {
  const result = await fetch(`/api/habilitar-operador`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      userUid: userUid,
      disabled: false,
    }),
  });
  const resultJson = await result.json();
  if (resultJson.error) {
    return { error: resultJson.error };
  }
  return { error: false };
};
