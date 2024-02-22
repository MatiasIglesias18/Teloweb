import {
  Dialog,
  DialogOverlay,
  DialogPortal,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import FotosLink from "./FotosLinks";



const VisualizadorCampos = ({ campos, tipo }) => {
  let content = null;
  if (tipo === "telo" || tipo === "tipoHab") {
    content = (
      <>
        {/*Mostrar listado de los campos en el objeto campos como una lista*/}
        <ul>
          {Object.keys(campos).map((key) => {
            //console.log(key, campos[key]);
            return (
              <li key={key}>
                <span className="font-semibold">{key}:</span>{" "}
                {JSON.stringify(campos[key])}
              </li>
            );
          })}
        </ul>
      </>
    );
  } else if (tipo === "fotosTelo" || tipo === "fotosTipoHab") {
    content = <FotosLink arrayRefs={campos.imagenes} />;
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="max-w-xs">Ver</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Lista de cambios de campo</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
};

export default VisualizadorCampos;
