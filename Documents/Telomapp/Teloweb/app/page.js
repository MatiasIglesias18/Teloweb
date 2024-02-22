import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function Home() {
  return (
    <main className="flex flex-col p-4 container items-center">
      <h1 className="text-3xl font-bold mb-4">TeloWeb</h1>
      <div className="flex flex-row gap-2">
        <Button asChild>
          <Link href="/login">Ingresar</Link>
        </Button>
      </div>
    </main>
  );
}
