"use client";
import { useState, useEffect } from "react";
import { useTipoHabContext } from "@/app/context/TipoHabProvider";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import solicitarUpdateDatosTipoHab from "@/app/utils/manejoHabitaciones/solicitarUpdateDatosTipoHab";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Dialog,
  DialogContent as DialogContentNormal,
  DialogTrigger as DialogTriggerNormal,
} from "@/components/ui/dialog";

import { AiOutlineLoading } from "react-icons/ai";
/*import styles from "./SelectorTelos.module.css";*/

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import * as z from "zod";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase/config";

const formSchema = z.object({
  tipoHabNombrePublico: z.string().min(3, {
    message: "El nombre debe tener al menos 3 caracteres",
  }),
  tipoHabDescripcion: z.string().min(3, {
    message: "La descripción debe tener al menos 3 caracteres",
  }),
  tipoHabPrecio: z.string({
    invalid_type_error: "El precio debe ser un número",
  }),
});

//convertir todo a shadcn y mejorar formulario, agregar que carge el tipo de habitacion dependiendo del param
export function FormularioDatosTipoHabitacion() {
  const [procesandoForm, setProcesandoForm] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [cambiosPendientes, setCambiosPendientes] = useState(false);
  const params = useParams();
  const { tipoHabitacionDoc } = useTipoHabContext();
  const tipoHabData = tipoHabitacionDoc.data();

  useEffect(() => {
    (async () => {
      const queryCambios = query(
        collection(db, "cambios"),
        where("docUid", "==", tipoHabitacionDoc?.id),
        where("type", "==", "tipoHab"),
        where("estado", "==", "pendiente")
      );
      const querySnapshot = await getDocs(queryCambios);
      if (!querySnapshot.empty) {
        setCambiosPendientes(true);
        return;
      }
      setCambiosPendientes(false);
    })();
  });

  //Crea el form
  const form = useForm({
    resolver: zodResolver(formSchema),

    defaultValues: {
      tipoHabNombrePublico: tipoHabData.nombrePublico,
      tipoHabDescripcion: tipoHabData.descripcion,
      tipoHabPrecio: tipoHabData.precio,
    },
  });

  function onSubmit(values) {
    (async (values) => {
      setProcesandoForm(true);
      const parsedValues = {
        nombrePublico: values.tipoHabNombrePublico,
        descripcion: values.tipoHabDescripcion,
        precio: values.tipoHabPrecio,
      };
      try {
        console.log("Solicitando cambio de datos");
        await solicitarUpdateDatosTipoHab(
          parsedValues,
          decodeURI(params.teloUid),
          tipoHabitacionDoc.id
        );
        console.log("Cambios solicitados con éxito");
      } catch (error) {
        console.error(error);
        console.log("Hubo un error al generar la solicitud de cambios");
      } finally {
        setProcesandoForm(false);
      }
    })(values);
  }
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTriggerNormal asChild>
        <div>
          <Button className="max-w-xs">Solicitar Cambio de Datos</Button>
          {cambiosPendientes && (
            <p className="text-red-700 font-semibold text-sm mx-auto text-center">
              (!) Hay cambios pendientes
            </p>
          )}
        </div>
      </DialogTriggerNormal>
      <DialogContentNormal>
        <div className="w-full">
          <h2 className="text-2xl font-bold mb-4">
            Formulario para solicitar cambios de datos
          </h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="tipoHabNombrePublico"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de Tipo de Habitación</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Por Ej.: Habitacion Premium"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Este es el nombre público que verán los usuarios para este
                      Tipo de Habitación.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tipoHabDescripcion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción de Tipo de Habitación</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Ingrese descripción de Tipo de Habitación"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Esta será la descripción del Tipo de Habitación que los
                      usuarios verán en la aplicacion.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tipoHabPrecio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ingrese el precio para las habitaciones dentro de este Tipo de Habitacion"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Este será el precio que los usuarios verán en la
                      aplicacion.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit" className="ml-full">
                  {procesandoForm ? (
                    <span className="flex justify-center items-center gap-2">
                      <AiOutlineLoading
                        className="animate-spin"
                        style={{ fontSize: "1.5em" }}
                      />{" "}
                      Procesando...
                    </span>
                  ) : (
                    "Enviar solicitud de cambios"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContentNormal>
    </Dialog>
  );
}

export default FormularioDatosTipoHabitacion;
