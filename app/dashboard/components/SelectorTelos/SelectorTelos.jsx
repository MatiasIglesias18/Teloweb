'use client'
import { useState, useEffect } from "react";
import getTelos from "@/app/utils/manejoTelos/getTelos";
import Telo from "./Telo";
import { useAuthContext } from "@/app/context/AuthProvider";


import ModalAgregarTelo from "./ModalAgregarTelo";

//Muestra un listado de telos para seleccionar
export default function SelectorTelos() {
  const { user } = useAuthContext();
  const [telos, setTelos] = useState([]);

  useEffect(() => {
    if (!user) return;
    getTelos(user).then((result, error) => {
      setTelos(result);
    });
  }, [user]);

  return (
    <div className="container flex flex-wrap justify-center gap-4 p-4 mx-auto ">
      {telos ? telos.map((telo) => (
        <Telo key={telo.nombre} telo={telo}></Telo>
      )) : null}
      <div className="flex flex-col items-center justify-center p-4 rounded-lg max-w-sm gap-4 ">
        <ModalAgregarTelo setTelos={setTelos} user={user}/>
      </div>
    </div>
  );
}
