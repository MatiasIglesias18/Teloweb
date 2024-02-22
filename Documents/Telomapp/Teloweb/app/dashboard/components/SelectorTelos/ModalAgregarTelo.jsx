"use client";
import { barriosCABA } from "@/app/utils/barriosCABA";
import { useState } from "react";
import { crearTelo } from "@/app/utils/manejoTelos/crearTelo";
import {
  DialogScrolleable,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog-scrolleable";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FaPlusCircle } from "react-icons/fa";
import { AiOutlineLoading } from "react-icons/ai";
import styles from "./SelectorTelos.module.css";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import * as z from "zod";

import getTelos from "@/app/utils/manejoTelos/getTelos";

const formSchema = z.object({
  teloNombre: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(15, "El nombre debe tener como maximo 15 caracteres"),
  teloDescripcion: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .max(200, "La descripción debe tener como maximo 200 caracteres"),
  teloBarrio: z
    .string({
      required_error: "Por favor selecciona un barrio",
    })
    .min(1, "Por favor selecciona un barrio"),
  teloDireccion: z
    .string()
    .min(3, "La dirección debe tener al menos 3 caracteres"),
});

export default function ModalAgregarTelo({ setTelos, user }) {
  const [procesandoForm, setProcesandoForm] = useState(false);
  const [open, setOpen] = useState(false);

  //Crea el form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teloNombre: "",
      teloDescripcion: "",
      teloBarrio: "",
      teloDireccion: "",
    },
  });

  async function onSubmit(values) {
    setProcesandoForm(true);
    try {
      const result = await crearTelo(values, user.uid);

      if (result.success) {
        console.log("Éxito al agregar");
        const telos = await getTelos(user);
        setTelos(telos);
      } else {
        console.error(result);
      }
      setProcesandoForm(false);
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <DialogScrolleable open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div>
          <FaPlusCircle size="3em" className={styles.agregarTelo} />
        </div>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay className={styles.DialogOverlay}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Crear Telo</DialogTitle>
              <DialogDescription>
                Crearás tu Telo aquí. Luego podrás agregar imagenes,
                descripción, servicios y más desde el panel de control.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="teloNombre"
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
                        Esta será la descripción del Telo que los usuarios verán
                        en la aplicacion.
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
                        correctamente en las búsquedas por zona que realizan los
                        usuarios.
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
                <div className="flex justify-end">
                  <Button type="submit" className="ml-full">
                    {procesandoForm ? (
                      <span className="flex justify-center items-center gap-2">
                        <AiOutlineLoading
                          className="animate-spin"
                          style={{ fontSize: "1.5em" }}
                        />
                        Procesando...
                      </span>
                    ) : (
                      // Aquí agregas lo que quieres renderizar cuando no se cumple la condición
                      "Crear"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </DialogOverlay>
      </DialogPortal>
    </DialogScrolleable>
  );
}
