export const cambiarPasswdOperador = async (uid, newPasswd) => {
  try {
    const response = await fetch(`/api/users/${uid}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "changePasswd",
        newPasswd: newPasswd,
      }),
    });
    const result = await response.json();
    if (response.status !== 200) {
      return [, result];
    }
    return [result, null];
  } catch (error) {
    console.log(error);
    return [, error];
  }
};
