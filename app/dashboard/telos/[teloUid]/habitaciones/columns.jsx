"use client";
import * as React from "react";

import updateEstadoHabitacion from "@/app/utils/manejoHabitaciones/updateEstadoHabitacion";
import eliminarHabitacion from "@/app/utils/manejoHabitaciones/eliminarHabitacion";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioItem,
  DropdownMenuRadioGroup,
} from "@/components/ui/dropdown-menu";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { LuMoreHorizontal } from "react-icons/lu";
import { deleteDoc, updateDoc } from "firebase/firestore";
import cancelarReserva from "@/app/utils/manejoReserva/cancelarReserva";

export const columns = [
  {
    accessorKey: "uid",
    header: "Uid",
  },
  {
    accessorKey: "numeroHabitacion",
    header: "Numero de habitación",
  },
  {
    accessorKey: "estado",
    header: "Estado",
    cell: ({ row }) => {
      const codeEstado = row.original.estado;
      const reservaUid = row.original.reservaUid ? row.original.reservaUid : "";
      let textoEstado = "";
      let claseEstado = "";

      const handleCambioEstado = async (value) => {
        const valorDB = parseInt(value);
        let result = await updateEstadoHabitacion(
          row.original.uid,
          valorDB,
          row.original.teloUid
        );
        if (result.error) {
          console.error(
            "Hubo un error al cambiar el estado de la habiacion:",
            result.error
          );
          return;
        }
        console.log(
          "Habitacion correctamente cambiada al estado: ",
          result.success
        );
      };

      const handleCancelarReserva = async (reservaUid) => {
        if (!reservaUid) {
          return;
        }
        await cancelarReserva(reservaUid);
      };

      switch (codeEstado) {
        case 0:
          textoEstado = "No Disponible";
          claseEstado = "bg-red-500";
          break;
        case 1:
          textoEstado = "Disponible";
          claseEstado = "bg-green-500";
          break;
        case 2:
          textoEstado = "Reservada";
          claseEstado = "bg-blue-500";
          break;
        case 3:
          textoEstado = "Ocupada";
          claseEstado = "bg-yellow-500";
          break;
      }
      return (
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Badge
                className={`${claseEstado} text-white`}
              >{`${textoEstado}`}</Badge>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Cambiar Estado/Reserva</DropdownMenuLabel>
              <DropdownMenuSeparator />

              {(codeEstado === 0 || codeEstado === 3) && (
                <DropdownMenuItem onSelect={() => handleCambioEstado(1)}>
                  Disponible
                </DropdownMenuItem>
              )}
              {codeEstado === 1 && (
                <DropdownMenuItem onSelect={() => handleCambioEstado(0)}>
                  No Disponible
                </DropdownMenuItem>
              )}
              {codeEstado === 2 && (
                <>
                  <DropdownMenuItem
                    onSelect={() => handleCancelarReserva(reservaUid)}
                  >
                    Cancelar Reserva
                  </DropdownMenuItem>
                  {/*<DropdownMenuItem onSelect={() => handleVerReserva(row.original.uid)}>Ver Reserva</DropdownMenuItem>*/}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
  {
    accessorKey: "tipoHabitacion",
    header: "Tipo de habitación",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const habitacion = row.original;

      const handleEliminarHabitacion = async (habitacionUid, teloUid) => {
        let result = await eliminarHabitacion(habitacionUid, teloUid);
        if (result.error) {
          console.error(
            "Hubo un error al eliminar la habiacion:",
            result.error
          );
          return;
        }
        console.log("Habitacion correctamente eliminada: ", result.success);
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
            <DropdownMenuItem
              onClick={() =>
                handleEliminarHabitacion(habitacion.uid, habitacion.teloUid)
              }
            >
              Eliminar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Ver Tipo Habitacion</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
