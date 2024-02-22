"use client";
import * as React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { LuMoreHorizontal } from "react-icons/lu";
import cancelarReserva from "@/app/utils/manejoReserva/cancelarReserva";
import eliminarReserva from "@/app/utils/manejoReserva/eliminarReserva";

export const columns = [
  {
    accessorKey: "uid",
    header: "Uid",
  },
  {
    accessorKey: "userEmail",
    header: "Usuario",
  },
  {
    accessorKey: "numeroHabitacion",
    header: "Numero de habitación",
  },

  {
    accessorKey: "tipoHabitacionName",
    header: "Tipo de habitación",
  },
  { accessorKey: "fechaReserva", header: "Fecha de Reserva" },
  {accessorKey: "codigo", header: "Codigo de Reserva" },
  {
    accessorKey: "estado",
    header: "Estado",
    cell: ({ row }) => {
      const codeEstado = row.original.estado;
      let textoEstado = "";
      let claseEstado = "";

      switch (codeEstado) {
        case 0:
          textoEstado = "Vencida";
          claseEstado = "bg-red-500";
          break;
        case 1:
          textoEstado = "Activa";
          claseEstado = "bg-green-500";
          break;
        case 2:
          textoEstado = "Completada";
          claseEstado = "bg-blue-500";
          break;
      }
      return (
        <div className="flex items-center gap-2">
          <Badge
            className={`${claseEstado} text-white`}
          >{`${textoEstado}`}</Badge>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const habitacion = row.original;
      const codeEstado = row.original.estado;

      const handleCancelarReserva = async (reservaUid) => {
        const result = await cancelarReserva(reservaUid);
        if (!result.result) {
          console.error(result.error);
          return;
        }
        console.log("Reserva cancelada con exito");
      };

      const handleEliminarReserva = async (reservaUid) => {
        const [result, error ] = await eliminarReserva(reservaUid);
        if (error) {
          console.error(error);
          return;
        }
        console.log("Reserva eliminada con exito");
      };


      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <LuMoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            {codeEstado === 1 && (
              <DropdownMenuItem className="cursor-pointer"
                onSelect={() => handleCancelarReserva(row.original.uid)}
              >
                Cancelar Reserva
              </DropdownMenuItem>
            )}
            {(codeEstado === 2 || codeEstado === 0) && (
              <DropdownMenuItem className="cursor-pointer"
                onSelect={() => handleEliminarReserva(row.original.uid)}
              >
                Eliminar Reserva
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
