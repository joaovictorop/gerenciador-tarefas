import Link from "next/link";
import { notFound } from "next/navigation";
import { FormularioTarefa } from "@/app/_components/formulario-tarefa";
import { getQueryClient, trpc } from "@/trpc/server";

export default async function EditarTarefa({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const tarefa = await getQueryClient().fetchQuery(
      trpc.tarefa.obterPorId.queryOptions({ id }),
    );

    return (
      <main>
        <h1>Editar tarefa</h1>
        <Link href="/">Voltar</Link>
        <FormularioTarefa tarefa={tarefa} />
      </main>
    );
  } catch {
    notFound();
  }
}
