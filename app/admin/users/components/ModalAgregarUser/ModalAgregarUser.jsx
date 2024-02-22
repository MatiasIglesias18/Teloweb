"use client";
import { useState } from "react";
import crearHabitacion from "@/app/utils/manejoHabitaciones/crearHabitacion";
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { FaPlusCircle } from "react-icons/fa";
import { AiOutlineLoading } from "react-icons/ai";
import styles from "./ModalAgregarUser.module.css";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import * as z from "zod";

import { useParams } from "next/navigation";
import { crearOperador } from "@/app/utils/admin/usuarios/crearOperador";

const tiposHabitacion = [
  { label: "Básica", value: "basica" },
  { label: "Superior", value: "superior" },
  { label: "Premium", value: "premium" },
  { label: "Top", value: "top" },
];

const formSchema = z.object({
  email: z.string({ required_error: "Por favor ingresa un email" }).email(),
  passwd: z
    .string({
      required_error: "Por favor ingresa una contraseña",
    })
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export function ModalAgregarUser() {
  const [procesandoForm, setProcesandoForm] = useState(false);
  const [open, setOpen] = useState(false);


  //Crea el form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      passwd: "",
    },
  });

  async function onSubmit(values) {
    setProcesandoForm(true);
    const result = await crearOperador(values.email, values.passwd);

    if (!result.error) {
      console.log("Éxito al Crear Operador");
    } else {
      console.error(result.error);
    }
    setProcesandoForm(false);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div>
          <FaPlusCircle size="2.5em" className={styles.agregarHabitacion} />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear Usuario Operador</DialogTitle>
          <DialogDescription>
            Se creará un Usuario Operador. Recuerda habilitarlo para que pueda
            iniciar sesión.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="ejemplo@ejemplo.com.ar" {...field} />
                  </FormControl>
                  <FormDescription>El email debe ser único.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="passwd"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Ingrese la contraseña" {...field} />
                  </FormControl>
                  <FormDescription>La contraseña que el operador utilizará para ingresar.</FormDescription>
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
