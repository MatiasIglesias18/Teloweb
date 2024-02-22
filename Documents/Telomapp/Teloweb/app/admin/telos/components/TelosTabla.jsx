"use client";
import { columns } from "./columns";

import { DataTable } from "@/components/ui/data-table";

import { collection, onSnapshot} from "firebase/firestore";
import { db } from "@/firebase/config";
import { useEffect, useState } from "react";

export function TelosTabla() {
  const [telos, setTelos] = useState([]);

  useEffect(() => {
    const usersCollectionQuery = collection(db, "telos");

    const unsubscribe = onSnapshot(usersCollectionQuery, (snapshot) => {
      const updatedTelos = snapshot.docs.map(async (doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          uid: doc.id,
          email: data.email,
          nombre: data.nombre,
          habilitado: data.habilitado,
          publicado: data.publicado,
          operadorUid: data.operadorUid,
          operadorRef: data.operador,
          fechaCreacion: data.fechaCreacion,
          servicios: data.servicios,
          telefono: data.telefono,
          teloLongitud: data.teloLongitud,
          teloLatitud: data.teloLatitud,
          direccion: data.direccion,
          descripcion: data.descripcion,
        };
      });
      Promise.all(updatedTelos).then((telosArray) => {
        setTelos(telosArray);
      });
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="w-full flex flex-col gap-5">
      <DataTable columns={columns} data={telos} />
    </div>
  );
}
