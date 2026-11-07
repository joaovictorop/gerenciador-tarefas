import Link from "next/link";
import { FormularioTarefa } from "@/app/_components/formulario-tarefa";

export default function NovaTarefa() {
  return (
    <main>
      <h1>Nova tarefa</h1>
      <Link href="/">Voltar</Link>
      <FormularioTarefa />
    </main>
  );
}
