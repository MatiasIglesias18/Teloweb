"use client";
import { columns } from "./columns";

import { DataTable } from "@/components/ui/data-table";

import { collection, onSnapshot, where, query } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useEffect, useState } from "react";

export function UsersTabla() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const usersCollectionQuery = query(
      collection(db, "users"),
      where("tipoUsuario", "==", "operador")
    );

    const unsubscribe = onSnapshot(usersCollectionQuery, (snapshot) => {
      const updatedUsuarios = snapshot.docs.map(async (doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          uid: doc.id,
          email: data.email,
          displayName: data.displayName,
          deshabilitado: data.deshabilitado,
        };
      });
      Promise.all(updatedUsuarios).then((usrsArray) => {
        setUsuarios(usrsArray);
      });
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="w-full flex flex-col gap-5">
      <DataTable columns={columns} data={usuarios} />
    </div>
  );
}
