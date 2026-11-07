"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useState } from "react";

type Mensagem = { tipo: "sucesso" | "erro"; texto: string } | null;

export function ListaTarefas() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [mensagem, setMensagem] = useState<Mensagem>(null);
  const tarefas = useQuery(trpc.tarefa.listar.queryOptions());
  const remover = useMutation(
    trpc.tarefa.remover.mutationOptions({
      onSuccess: async () => {
        setMensagem({ tipo: "sucesso", texto: "Tarefa excluída com sucesso." });
        await queryClient.invalidateQueries({
          queryKey: trpc.tarefa.listar.queryKey(),
        });
      },
      onError: (erro) => {
        setMensagem({
          tipo: "erro",
          texto: erro.message || "Não foi possível excluir a tarefa.",
        });
      },
    }),
  );

  if (tarefas.isLoading) {
    return <p>Carregando tarefas...</p>;
  }

  if (tarefas.isError) {
    return <p>Não foi possível carregar as tarefas.</p>;
  }

  const lista = tarefas.data ?? [];
  const feedback = mensagem && (
    <p
      role="status"
      aria-live="polite"
      style={{ color: mensagem.tipo === "erro" ? "crimson" : "green" }}
    >
      {mensagem.texto}
    </p>
  );

  if (lista.length === 0) {
    return (
      <>
        {feedback}
        <p>Nenhuma tarefa cadastrada.</p>
      </>
    );
  }

  return (
    <>
      {feedback}
      <ul>
        {lista.map((tarefa) => {
          const excluindo =
            remover.isPending && remover.variables?.id === tarefa.id;

          return (
            <li key={tarefa.id}>
              <strong>{tarefa.titulo}</strong>
              {tarefa.descricao && <p>{tarefa.descricao}</p>}
              <p>
                {new Date(tarefa.dataCriacao).toLocaleString("pt-BR", {
                  timeZone: "America/Fortaleza",
                })}
              </p>
              <button
                type="button"
                disabled={remover.isPending}
                onClick={() => {
                  if (window.confirm("Excluir esta tarefa?")) {
                    setMensagem(null);
                    remover.mutate({ id: tarefa.id });
                  }
                }}
              >
                {excluindo ? "Excluindo..." : "Excluir"}
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );
}
