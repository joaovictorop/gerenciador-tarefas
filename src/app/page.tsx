import { getQueryClient, HydrateClient, trpc } from "@/trpc/server";
import { ListaTarefas } from "./_components/lista-tarefas";

export const dynamic = "force-dynamic";

export default async function Home() {
  await getQueryClient().prefetchQuery(trpc.tarefa.listar.queryOptions());

  return (
    <main>
      <h1>Gerenciador de Tarefas</h1>
      <HydrateClient>
        <ListaTarefas />
      </HydrateClient>
    </main>
  );
}
