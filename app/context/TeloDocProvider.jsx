"use client";
import React from "react";
import { db } from "@/firebase/config";
import { useParams } from "next/navigation";
import { useAuthContext } from "./AuthProvider";
import { onSnapshot } from "firebase/firestore";
import {  doc } from "firebase/firestore";

export const TeloContext = React.createContext({});

export const useTeloContext = () => React.useContext(TeloContext);

export const TeloContextProvider = ({ children }) => {
  const params = useParams();
  const teloUid = decodeURI(params.teloUid);
  const { user } = useAuthContext();
  const [teloDoc, setTeloDoc] = React.useState(undefined);
  const [teloRef, setTeloRef] = React.useState(undefined);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!teloUid) {
      return;
    }
    if (!user) {
      return;
    }
    const teloDocRef = doc(db, "telos", teloUid);
    const unsubscribe = onSnapshot(
      teloDocRef,
      (doc) => {
        setTeloDoc(doc.data());
        setTeloRef(doc.ref);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [teloUid, user]);

  return (
    <TeloContext.Provider value={{ teloDoc, teloRef }}>
      {loading ? <div>Cargando Informacion de Telo...</div> : children}
    </TeloContext.Provider>
  );
};
