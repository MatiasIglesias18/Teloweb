"use client";
import * as React from "react";

import SwitchHabilitarTelo from "./SwitchHabilitarTelo";
import TeloActions from "./TeloActions";

import OperadorName from "./OperadorName";

export const columns = [
  {
    header: "Uid",
    accessorKey: "uid",
  },
  {
    header: "Nombre de Telo",
    accessorKey: "nombre",
  },
  {
    header: "Operador",
    accesorKey: "operador",
    cell: ({ row }) => {
      return <OperadorName operadorUid={row.original.operadorUid} />;
    },
  },
  {
    header: "Habilitado",
    id: "habilitado",
    cell: ({ row }) => {
      const habilitado = row.original.habilitado;
      return (
        <SwitchHabilitarTelo
          teloHabilitado={habilitado}
          uid={row.original.uid}
        />
      );
    },
  },
  {
    header: "Acciones",
    id: "acciones",
    cell: ({ row }) => {
      return <TeloActions uid={row.original.uid} />;
    },
  },
];
