const solicitarUpdateDatosTelo = async (values, uidTelo) => {
    try {
        const response = await fetch("/api/cambio-datos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            docUid: uidTelo,
            values: values,
            action: "update",
            type: "telo",
            teloUid: uidTelo,
          }),
        });
    }
    catch (error) { 
        console.log(error.code);
        return { error: error };
    }
    
}

export default solicitarUpdateDatosTelo;