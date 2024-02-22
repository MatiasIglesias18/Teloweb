"use client";
import { useState } from "react";
import  crearHabitacion  from "@/app/utils/manejoHabitaciones/crearHabitacion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { FaPlusCircle } from "react-icons/fa";
import { AiOutlineLoading } from "react-icons/ai";
import styles from "./ModalAgregarHab.module.css";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import * as z from "zod";

import { useParams } from "next/navigation";

const tiposHabitacion = [
  {label: "Básica", value: "basica"},
  {label: "Superior", value: "superior"},
  {label: "Premium", value: "premium"},
  {label: "Top", value: "top"},
];

const formSchema = z.object({
  numeroHabitacion: z
    .string()
    .min(1, "El nombre debe tener al menos 1 caracteres"),
    tipoHabitacionUid: z.string({
    required_error: "Por favor selecciona un tipo de habitación",
  }),
  tipoHabitacionUid: z.string({
    required_error: "Por favor selecciona un tipo de habitación",
  }).min(1, "Por favor selecciona un tipo de habitación")
});

export default function ModalAgregarHab() {
  const [procesandoForm, setProcesandoForm] = useState(false);
  const params = useParams();

  //Crea el form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numeroHabitacion: "",
      tipoHabitacionUid: "",
    },
  });

  async function onSubmit(values) {
    setProcesandoForm(true);
    try {
      const result = await crearHabitacion(
        decodeURI(params.teloUid),
        values.numeroHabitacion,
        values.tipoHabitacionUid
      );

      if (result.result) {
        console.log("Éxito al agregar Habitación: ", result.result);
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error(error);
    }
    setProcesandoForm(false);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div>
          <FaPlusCircle size="2.5em" className={styles.agregarHabitacion} />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear Habitación</DialogTitle>
          <DialogDescription>
            Las habitaciones se crean con el estado &quot;no disponible&quot;.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="numeroHabitacion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de habitación</FormLabel>
                  <FormControl>
                    <Input placeholder="Por ej.: 1A" {...field} />
                  </FormControl>
                  <FormDescription>
                    El número de habitación debe ser único.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tipoHabitacionUid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Habitación</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un tipo de habitación" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tiposHabitacion.map((barrio, index) => (
                        <SelectItem key={barrio.value} value={`${barrio.value}`}>
                          {barrio.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    El tipo de habitación.
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
                  "Crear"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
