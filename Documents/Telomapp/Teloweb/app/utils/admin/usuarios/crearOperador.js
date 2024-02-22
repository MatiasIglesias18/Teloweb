export const crearOperador = async (email, passwd) => {
  try {
    const response = await fetch("/api/registrar-operador", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        passwd: passwd,
      }),
    });
    return {error: false}
  } catch (error) {
    console.log(error.code);
    return { error: error };
  }
};
