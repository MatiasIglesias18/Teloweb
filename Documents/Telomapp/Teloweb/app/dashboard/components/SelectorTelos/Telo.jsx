import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function Telo({ telo }) {
  const teloURI = encodeURI(telo.uid);
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-md max-w-sm gap-4">
      <h2 className="font-bold text-lg">{telo.nombre}</h2>
      <Link href={`/dashboard/telos/${teloURI}`} ><Button>Ingresar</Button></Link>
    </div>
  );
}
