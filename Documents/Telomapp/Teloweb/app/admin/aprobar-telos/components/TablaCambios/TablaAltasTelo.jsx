"use client";
import { db } from "@/firebase/config";
import { columns } from "./columns";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { DataTableCambios } from "@/components/shared/DataTableCambios/DataTableCambios";

const TablaAltasTelo = () => {
  const [cambios, setCambios] = useState([]);
  useEffect(() => {
    const cambiosCollection = query(collection(db, "cambios"), where("type", "==", "altaTelo"));

    const unsubscribe = onSnapshot(cambiosCollection, (snapshot) => {
      const updatedCambios = snapshot.docs.map(async (doc) => {
        const data = doc.data();
        const creado = data.creado.toDate();

        return {
          id: doc.id,
          uid: doc.id,
          estado: data.estado,
          creado: creado,
          tipo: data.type,
          action: data.action,
          docRef: data.docRef,
          email: data.operadorEmail,
          operadorUid: data.operadorUid,
          operadorName: data.operadorName,
          operadorRef: data.operadorRef,
          teloUid: data.teloUid,
          teloRef: data.teloRef,
          teloName: data.teloName,
          cambioRef: doc.ref,
          values: data.campos,
        };
      });
      Promise.all(updatedCambios).then((cambiosArray) => {
        setCambios(cambiosArray);
      });
    });

    return () => unsubscribe();
  }, []);

  return <DataTableCambios columns={columns} data={cambios} />;
};

export default TablaAltasTelo;
