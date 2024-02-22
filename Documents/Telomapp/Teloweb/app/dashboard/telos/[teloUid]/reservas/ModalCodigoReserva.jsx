"use client";
import { useState } from "react";
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
import { FaPlusCircle } from "react-icons/fa";
import { AiOutlineLoading } from "react-icons/ai";
import styles from "./ModalAgregarCodRes.module.css";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import * as z from "zod";

import inputCodigoReserva from "@/app/utils/manejoReserva/inputCodigoReserva";

const formSchema = z.object({
  codigoReserva: z
    .string()
    .min(1, "El nombre debe tener al menos 1 caracteres"),
});

export function ModalCodigoReserva() {
  const [procesandoForm, setProcesandoForm] = useState(false);
  const [open, setOpen] = useState(false);

  //Crea el form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      codigoReserva: "",
    },
  });

  async function onSubmit(values) {
    setProcesandoForm(true);
    try {
      const result = await inputCodigoReserva(
        values.codigoReserva,
      );

      if (result.result) {
        console.log("Éxito al aceptar la reserva: ", result.result);
        setOpen(false);
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error(error);
    }
    
    
    setProcesandoForm(false);
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
          <DialogTitle>Recepcionar Reserva</DialogTitle>
          <DialogDescription>
           La reserva pasará a estado &quot;Aceptada&quot;. 
           <br />La habitación correspondiente a &quot;Ocupada&quot;.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="codigoReserva"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código de Reserva</FormLabel>
                  <FormControl>
                    <Input placeholder="Por ej.: 1adZ34qjL" {...field} />
                  </FormControl>
                  <FormDescription>
                    El código de reserva que provee el cliente.
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
                  "Aceptar"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
