"use client";
import { barriosCABA } from "@/app/utils/barriosCABA";
import { servicios } from "@/app/utils/serviciosTelos";
import { useEffect, useState } from "react";
import { useTeloContext } from "@/app/context/TeloDocProvider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import solicitarUpdateDatosTelo from "@/app/utils/manejoTelos/solicitarUpdateDatosTelo";
import styles from "./FormDatos.module.css";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DialogScrolleable,
  DialogContent,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog-scrolleable";
import { Checkbox } from "@/components/ui/checkbox";
import { AiOutlineLoading } from "react-icons/ai";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import * as z from "zod";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase/config";

const formSchema = z.object({
  teloName: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(15, "El nombre debe tener como maximo 15 caracteres"),
  teloDescripcion: z
    .string()
    .min(3, "La descripción debe tener al menos 3 caracteres")
    .max(500, "La descripción debe tener como maximo 500 caracteres"),
  teloBarrio: z.string({
    required_error: "Por favor selecciona un barrio",
  }),
  teloDireccion: z
    .string()
    .min(3, "La dirección debe tener al menos 3 caracteres"),
  teloServicios: z.array(z.string()).optional(),
  teloLatitud: z.string(),
  teloLongitud: z.string(),
  teloEmail: z.string().email().optional(),
  teloTelefono: z.string().optional(),
});
export default function FormDatos() {
  const [procesandoForm, setProcesandoForm] = useState(false);
  const [open, setOpen] = useState(false);
  const [cambiosPendientes, setCambiosPendientes] = useState(false);
  const { teloDoc, teloRef } = useTeloContext();

  useEffect(() => {
    (async () => {
      const queryCambios = query(
        collection(db, "cambios"),
        where("teloUid", "==", teloRef?.id),
        where("type", "==", "telo"),
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
      teloName: teloDoc?.nombre ? teloDoc?.nombre : "",
      teloDescripcion: teloDoc?.descripcion ? teloDoc?.descripcion : "",
      teloBarrio: teloDoc?.barrio ? teloDoc?.barrio : "",
      teloDireccion: teloDoc?.direccion ? teloDoc?.direccion : "",
      teloServicios: teloDoc?.servicios ? teloDoc?.servicios : [],
      teloLatitud: teloDoc?.geopoint.latitud ? teloDoc?.geopoint.latitud : "0",
      teloLongitud: teloDoc?.geopoint.longitud
        ? teloDoc?.geopoint.longitud
        : "0",
      teloEmail: teloDoc?.email ? teloDoc?.email : "",
      teloTelefono: teloDoc?.telefono ? teloDoc?.telefono : "",
    },
  });

  function onSubmit(values) {
    (async (values) => {
      setProcesandoForm(true);
      const valores = {
        nombre: values.teloName,
        descripcion: values.teloDescripcion,
        barrio: values.teloBarrio,
        direccion: values.teloDireccion,
        email: values.teloEmail,
        servicios: values.teloServicios,
        telefono: values.teloTelefono,
        geopoint: {
          longitud: values.teloLatitud,
          latitud: values.teloLongitud,
        },
      };
      try {
        console.log("Solicitando cambios");
        await solicitarUpdateDatosTelo(valores, teloRef.id);
        console.log("Cambios solicitados con éxito");
        setOpen(false);
      } catch (error) {
        console.error(error);
        console.log("Hubo un error al generar la solicitudo de cambios");
      } finally {
        setProcesandoForm(false);
      }
    })(values);
  }
  return (
    <DialogScrolleable open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div>
          <Button className="max-w-xs">Solicitar Cambio de Datos</Button>
          {cambiosPendientes && (
            <p className="text-red-700 font-semibold text-sm mx-auto text-center">
              (!) Hay cambios pendientes
            </p>
          )}
        </div>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay className={styles.DialogOverlay}>
          <DialogContent className={styles.DialogContent}>
            <div className="w-full">
              <h2 className="text-2xl font-bold mb-4">
                Solicitar cambio de Datos
              </h2>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="teloName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre de Telo</FormLabel>
                        <FormControl>
                          <Input placeholder="Nombre de Telo" {...field} />
                        </FormControl>
                        <FormDescription>
                          Este es el nombre público que tendrá tu Telo.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="teloDescripcion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción de Telo</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Ingrese descripción de Telo"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Esta será la descripción del Telo que los usuarios
                          verán en la aplicacion.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="teloEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email de Contacto</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ingrese la dirección de email del Telo"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Esta será la dirección de email que los usuarios verán
                          en la aplicacion y que podrán utilizar para
                          contactarse.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="teloTelefono"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ingrese teléfono del Telo"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Esta será el número de teléfono que los usuarios verán
                          en la aplicacion y que podrán utilizar para
                          contactarse.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="teloDireccion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dirección</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ingrese la dirección en la que se encuentra el establecimiento"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Esta será la dirección del Telo que los usuarios verán
                          en la aplicacion.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="teloLongitud"
                    type="number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Longitud</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ingresa la coordenada de Longitud"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Ingresa la coordenada de Longitud.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="teloLatitud"
                    type="number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Latitud</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ingresa la coordenada de LAtitud"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Ingresa la coordenada de Latitud.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="teloBarrio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Barrio</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un barrio" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {barriosCABA.map((barrio, index) => (
                              <SelectItem key={index} value={`${index}`}>
                                {barrio}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          El barrio en donde se encuentra ubicado el Telo.
                          <br />
                          Esto es importante para que tu Telo aparezca
                          correctamente en las búsquedas por zona que realizan
                          los usuarios.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="teloServicios"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">Servicios</FormLabel>
                          <FormDescription>
                            Selecciona los servicios que ofreces en el
                            establecimiento.
                          </FormDescription>
                        </div>
                        {servicios.map((item) => (
                          <FormField
                            key={item.id}
                            control={form.control}
                            name="teloServicios"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={item.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(item.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                              ...field.value,
                                              item.id,
                                            ])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== item.id
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {item.label}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
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
                        // Aquí agregas lo que quieres renderizar cuando no se cumple la condición
                        "Enviar solicitud de cambios"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </DialogContent>
        </DialogOverlay>
      </DialogPortal>
    </DialogScrolleable>
  );
}
