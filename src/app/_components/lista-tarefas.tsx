"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export function ListaTarefas() {
  const trpc = useTRPC();
  const tarefas = useQuery(trpc.tarefa.listar.queryOptions());

  if (tarefas.isLoading) {
    return <p>Carregando tarefas...</p>;
  }

  if (tarefas.isError) {
    return <p>Não foi possível carregar as tarefas.</p>;
  }

  const lista = tarefas.data ?? [];

  if (lista.length === 0) {
    return <p>Nenhuma tarefa cadastrada.</p>;
  }

  return (
    <ul>
      {lista.map((tarefa) => (
        <li key={tarefa.id}>
          <strong>{tarefa.titulo}</strong>
          {tarefa.descricao && <p>{tarefa.descricao}</p>}
          <p>
            {new Date(tarefa.dataCriacao).toLocaleString("pt-BR", {
              timeZone: "America/Fortaleza",
            })}
          </p>
        </li>
      ))}
    </ul>
  );
}
