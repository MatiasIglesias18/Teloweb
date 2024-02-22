import { FaCheck } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { manejarCambio } from "@/app/utils/admin/cambios/manejarCambio";
import { FaTrash } from "react-icons/fa6";

import {
  Dialog,
  DialogOverlay,
  DialogPortal,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export const columns = [
  {
    header: "uid",
    accessorKey: "uid",
    sortable: true,
  },
  {
    header: "Fecha de creación",
    accessorKey: "creado",
    id: "creado",
    enableSorting: true,
    sortDescFirst: true,
    sortingFn: "datetime",
    sortDescFirst: false,
    cell: ({ row }) => {
      const creado = row.original.creado;
      const creadoFecha = creado.toLocaleDateString();
      const creadoTime = creado.toLocaleTimeString();
      const fechaCreado = creadoFecha + " " + creadoTime;
      return fechaCreado;
    },
  },
  {
    header: "Email / Usuario",
    accessorKey: "email",
  },
  {
    header: "Telo",
    accessorKey: "teloName",
  },

  {
    header: "Tipo",
    accessorKey: "tipo",
  },

  {
    header: "Estado",
    accessorKey: "estado",
    cell: ({ row }) => {
      const estado = row.original.estado;
      /*traduccion de estados a nombres legibles*/
      const estadoNombre = {
        pendiente: "Pendiente",
        aprobado: "Aprobado",
        rechazado: "Rechazado",
      };

      if (estado === "pendiente") {
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">
            {estadoNombre[estado]}
          </Badge>
        );
      } else if (estado === "aprobado") {
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            {estadoNombre[estado]}
          </Badge>
        );
      } else if (estado === "rechazado") {
        return (
          <Badge className="bg-slate-500 hover:bg-slate-600">
            {estadoNombre[estado]}
          </Badge>
        );
      } else {
        return <Badge>{estadoNombre[estado]}</Badge>;
      }
    },
  },

  {
    header: "Campos",
    accessorKey: "campos",
    id: "campos",
    cell: ({ row }) => {
      const campos = row.original;
      return (
        <Button size="sm" asChild>
          <Link href={`/admin/telo/${campos.teloUid}`} target="_blank">Ver Telo</Link>
        </Button>
      );
    },
  },
  {
    header: "Acciones",
    id: "actions",
    cell: ({ row }) => {
      function handleAprobarCambio(cambioUid) {
        (async () => {
          const res = await manejarCambio(cambioUid, "1");
          if (res.error) {
            console.log(res.error);
            return;
          }
          console.log(res.result);
        })();
      }

      function handleRechazarCambio(cambioUid) {
        (async () => {
          const res = await manejarCambio(cambioUid, "0");
          if (res.error) {
            console.log(res.error);
            return;
          }
          console.log(res.result);
        })();
      }

      function handleEliminarCambio(cambioUid) {
        (async () => {
          const res = await manejarCambio(cambioUid, "-1");
          if (res.error) {
            console.log(res.error);
            return;
          }
          console.log(res.result);
        })();
      }

      return (
        <div className="flex gap-2">
          {row.original.estado === "pendiente" && (
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  handleAprobarCambio(row.original.cambioRef.id);
                }}
              >
                <FaCheck className="h-4 w-4 text-green" fill="green" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  handleRechazarCambio(row.original.cambioRef.id);
                }}
              >
                <FaTimes className="h-4 w-4" fill="red" />
              </Button>
            </>
          )}
          {(row.original.estado === "aprobado" ||
            row.original.estado === "rechazado") && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                handleEliminarCambio(row.original.cambioRef.id);
              }}
            >
              <FaTrash className="h-4 w-4 text-green" fill="red" />
            </Button>
          )}
        </div>
      );
    },
  },
];
