"use client";
import React from "react";
import { useParams } from "next/navigation";
import { useAuthContext } from "./AuthProvider";
import { useTeloContext } from "./TeloDocProvider";
import { collection, onSnapshot } from "firebase/firestore";
import {  doc } from "firebase/firestore";

export const TipoHabContext = React.createContext({});

export const useTipoHabContext = () => React.useContext(TipoHabContext);

export const TipoHabContextProvider = ({ children }) => {
  const params = useParams();
  const teloUid = decodeURI(params.teloUid);
  const tipoHabitacionUid = decodeURI(params.tipoHabitacionUid);
  const {teloRef} = useTeloContext()
  const { user } = useAuthContext();
  const [tipoHabitacionDoc, setHabitacionDoc] = React.useState(undefined);
  const [tipoHabitacionRef, setTipoHabitacionRef] = React.useState(undefined);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!tipoHabitacionUid) {
      return;
    }
    if (!user) {
      return;
    }
    if (!teloRef) {
        return;
    }
    const tipoHabitacionRef = doc(collection(teloRef, "tiposHabitacion"), tipoHabitacionUid);
    const unsubscribe = onSnapshot(
        tipoHabitacionRef,
      (doc) => {
        setHabitacionDoc(doc);
        setTipoHabitacionRef(doc.ref);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [tipoHabitacionUid, user, teloUid, teloRef]);

  return (
    <TipoHabContext.Provider value={{ tipoHabitacionDoc, tipoHabitacionRef }}>
      {loading ? <div>Cargando Informacion de Tipo de Habitación...</div> : children}
    </TipoHabContext.Provider>
  );
};
