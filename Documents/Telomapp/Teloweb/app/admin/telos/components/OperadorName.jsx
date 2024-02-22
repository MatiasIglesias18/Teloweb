import React, { useState, useEffect } from "react";
import { db } from "@/firebase/config";
import { doc, getDoc } from "firebase/firestore";

const OperadorName = ({ operadorUid }) => {
  const [operador, setOperador] = useState(null);

  useEffect(() => {
    const getOperador = async () => {
      try {
        const docRef = doc(db, "users", operadorUid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setOperador(docSnap.data().email);
        } else {
          console.log("¡El operador no existe!");
          setOperador("Error");
        }
      } catch (error) {
        console.error("Error al obtener el operador:", error);
        setOperador("Error");
      }
    };
    getOperador();
  }, [operadorUid]);

  return <span>{operador}</span>;
};

export default OperadorName;
