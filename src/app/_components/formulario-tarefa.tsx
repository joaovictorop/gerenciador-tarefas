"use client";

import Link from "next/link";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import type { Tarefa } from "@/server/tarefas/tarefa.types";

type Mensagem = { tipo: "sucesso" | "erro"; texto: string } | null;

export function FormularioTarefa({ tarefa }: { tarefa?: Tarefa }) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [titulo, setTitulo] = useState(tarefa?.titulo ?? "");
  const [descricao, setDescricao] = useState(tarefa?.descricao ?? "");
  const [mensagem, setMensagem] = useState<Mensagem>(null);

  const onSuccess = async (texto: string) => {
    setMensagem({ tipo: "sucesso", texto });
    await queryClient.invalidateQueries({
      queryKey: trpc.tarefa.listar.queryKey(),
    });
  };

  const onError = (
    erro: { data?: { code?: string } | null; message: string },
  ) => {
    // A mensagem do Zod chega como JSON difícil de ler, então BAD_REQUEST recebe um texto simples.
    setMensagem({
      tipo: "erro",
      texto: erro.data?.code === "BAD_REQUEST" ? "Dados inválidos" : erro.message,
    });
  };

  const criar = useMutation(
    trpc.tarefa.criar.mutationOptions({
      onSuccess: async () => {
        setTitulo("");
        setDescricao("");
        await onSuccess("Tarefa criada com sucesso.");
      },
      onError,
    }),
  );
  const atualizar = useMutation(
    trpc.tarefa.atualizar.mutationOptions({
      onSuccess: () => onSuccess("Tarefa atualizada com sucesso."),
      onError,
    }),
  );
  const isPending = criar.isPending || atualizar.isPending;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMensagem(null);

    if (!titulo.trim()) {
      setMensagem({ tipo: "erro", texto: "O título é obrigatório." });
      return;
    }

    if (tarefa) {
      atualizar.mutate({
        id: tarefa.id,
        titulo: titulo.trim(),
        descricao: descricao.trim() || undefined,
      });
    } else {
      criar.mutate({
        titulo: titulo.trim(),
        descricao: descricao.trim() || undefined,
      });
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="titulo">Título</label>
        <input
          id="titulo"
          value={titulo}
          onChange={(event) => setTitulo(event.target.value)}
          disabled={isPending}
        />
      </div>
      <div>
        <label htmlFor="descricao">Descrição</label>
        <textarea
          id="descricao"
          value={descricao}
          onChange={(event) => setDescricao(event.target.value)}
          disabled={isPending}
        />
      </div>
      <button type="submit" disabled={isPending}>
        {isPending ? "Salvando..." : "Salvar"}
      </button>
      {mensagem && (
        <p
          role="status"
          aria-live="polite"
          style={{
            color: mensagem.tipo === "erro" ? "crimson" : "green",
          }}
        >
          {mensagem.texto}
        </p>
      )}
      {mensagem?.tipo === "sucesso" && <Link href="/">Voltar para a lista</Link>}
    </form>
  );
}
