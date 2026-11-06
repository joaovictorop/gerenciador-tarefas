import { TRPCError } from "@trpc/server";
import { router, publicProcedure } from "../trpc";
import {
    atualizarTarefa,
    criarTarefa,
    listarTarefas,
    obterTarefa,
    removerTarefa,
} from "./tarefa.store";
import {
    atualizarTarefaSchema,
    criarTarefaSchema,
    idTarefaSchema,
} from "./tarefa.schemas";

function tarefaNaoEncontrada() {
    return new TRPCError({
        code: "NOT_FOUND",
        message: "Tarefa não encontrada",
    });
}

export const tarefaRouter = router({
    listar: publicProcedure.query(() => listarTarefas()),

    obterPorId: publicProcedure
        .input(idTarefaSchema)
        .query(({ input }) => {
            const tarefa = obterTarefa(input.id);

            if (!tarefa) {
                throw tarefaNaoEncontrada();
            }

            return tarefa;
        }),

    criar: publicProcedure
        .input(criarTarefaSchema)
        .mutation(({ input }) => criarTarefa(input)),

    atualizar: publicProcedure
        .input(atualizarTarefaSchema)
        .mutation(({ input }) => {
            const tarefa = atualizarTarefa(input.id, {
                titulo: input.titulo,
                descricao: input.descricao,
            });

            if (!tarefa) {
                throw tarefaNaoEncontrada();
            }

            return tarefa;
        }),

    remover: publicProcedure
        .input(idTarefaSchema)
        .mutation(({ input }) => {
            const removida = removerTarefa(input.id);

            if (!removida) {
                throw tarefaNaoEncontrada();
            }

            return { sucesso: true };
        }),
});