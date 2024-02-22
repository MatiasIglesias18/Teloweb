"use client";
import * as React from "react";

import SwitchHabilitarUsuario from "./SwitchHabilitarUsuario";
import UserActions from "./UserActions";

export const columns = [
  {
    header: "Uid",
    accessorKey: "uid",
  },
  {
    header: "Email",
    accessorKey: "email",
  },
  {
    header: "Habilitado",
    id: "deshabilitado",
    cell: ({ row }) => {
      const deshabilitado = row.original.deshabilitado;
      return (
        <SwitchHabilitarUsuario
          userDesHabilitado={deshabilitado}
          uid={row.original.uid}
        />
      );
    },
  },
  {
    header: "Acciones",
    id: "acciones",
    cell: ({ row }) => {
      return <UserActions uid={row.original.uid} />;
    },
  },
];
