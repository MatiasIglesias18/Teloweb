"use client";
import { useEffect, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AiOutlineLoading } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { db } from "@/firebase/config";
import { doc, getDoc } from "firebase/firestore";

// Función reutilizable para hacer la solicitud al servidor
async function sendRequest(url, options) {
  const response = await fetch(url, options);
  return response;
}

export default function SignInForm(redirectTo = "/dashboard") {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const router = useRouter();

  useEffect(() => {
    (async () => {
      if (auth.currentUser) {
        auth.currentUser.getIdToken().then((token) => {
          fetch("/api/login", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .then((res) => {
              console.log("testlogin");
              return res.json();
            })
            .then((data) => {
              if (data.error) {
                console.log("Error al crear session cookie para el user");
                auth.signOut();
              }
              getUserDoc();
            });
        });
      }
    })();
  }, []);

  async function getUserDoc() {
    //si existe user, obtener su uid, obtener el documento del usuario
    if (auth.currentUser) {
      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      if (userDoc.exists()) {
        //redirigir al usuario a /dashboard o a /admin dependiendo tipo operador
        const tipoUsuario = userDoc.data().tipoUsuario;
        if (tipoUsuario === "admin") {
          console.log("El user es admin");
          router.push("/admin");
        } else if (tipoUsuario === "operador") {
          console.log("El user es operador");
          router.push("/dashboard");
        } else {
          console.log("El user no es admin ni operador");
          //Desloguearlo y redirigirlo a /login
          await auth.signOut();
          await fetch("http://localhost:3000/api/logout", {
            method: "POST",
          });
          setError("El usuario no es admin ni operador");
          router.push("/login");
        }
      } else {
        await fetch("http://localhost:3000/api/logout", {
          method: "POST",
        });
        setError("El usuario no existe en la base de datos");
        setLoading(false);
        console.log("Usuario no logueado");
      }
    } else {
      setLoading(false);
      console.log("Usuario no logueado");
    }
  }

  async function handleFormSubmit(event) {
    event.preventDefault();
    setLoading(true);
    const data = new FormData(event.currentTarget);

    try {
      const userCred = await signInWithEmailAndPassword(
        auth,
        data.get("email"),
        data.get("password")
      );
      await getUserDoc();
    } catch (error) {
      console.error(error.code);
      switch (error.code) {
        case "auth/invalid-email":
          setError("La dirección de correo electrónico no es válida.");
          break;
        case "auth/user-disabled":
          setError("La cuenta de usuario ha sido deshabilitada.");
          break;
        case "auth/user-not-found":
          setError(
            "No se encontró un usuario con la dirección de correo electrónico proporcionada."
          );
          break;
        case "auth/wrong-password":
          setError("La contraseña proporcionada no es válida.");
          break;
        case "auth/weak-password":
          setError(
            "La contraseña proporcionada no es lo suficientemente segura."
          );
          break;
        case "auth/email-already-in-use":
          setError(
            "La dirección de correo electrónico ya está en uso por otra cuenta."
          );
          break;
        case "auth/operation-not-allowed":
          setError(
            "El método de inicio de sesión utilizado no está permitido para este proyecto de Firebase."
          );
          break;
        case "auth/timeout":
          setError("Se agotó el tiempo de espera durante el inicio de sesión.");
          break;
        case "auth/network-request-failed":
          setError(
            "Hubo un problema de red durante la solicitud de inicio de sesión."
          );
          break;
        case "auth/too-many-requests":
          setError(
            "Se ha excedido el límite de intentos de inicio de sesión. El usuario ha sido temporalmente bloqueado."
          );
          break;
        // Agregar más casos según sea necesario
        default:
          setError("Error de inicio de sesión:", error.message);
      }
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto flex flex-col items-center gap-4 max-w-md ">
      <h1
        style={{ textAlign: "center", marginTop: 4 }}
        className="text-2xl text-center text-primary"
      >
        Iniciar Sesion
      </h1>

      <form
        onSubmit={handleFormSubmit}
        style={{ marginTop: 4 }}
        className="flex flex-col gap-4 w-full"
      >
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          required
          autoComplete="email"
          disabled={loading}
          autoFocus
          name="email"
        />
        <Label htmlFor="password">Contraseña</Label>
        <Input
          type="password"
          name="password"
          disabled={loading}
          required
          autoComplete="current-password"
        />

        <Button type="submit" disabled={loading}>
          {loading ? (
            <span className="flex justify-center items-center gap-2">
              <AiOutlineLoading
                className="animate-spin"
                style={{ fontSize: "1.5em" }}
              />{" "}
              Procesando...
            </span>
          ) : (
            "Iniciar Sesion"
          )}
        </Button>
      </form>
      {error && <p className="text-red-700">{"¡Error!" + " " + error}</p>}
    </div>
  );
}
