import { z } from "zod";

export const criarTarefaSchema = z.object({
    titulo: z.string().trim().min(1, "O título é obrigatório"),
    descricao: z.string().trim().optional(),
});

export const atualizarTarefaSchema = criarTarefaSchema.extend({
    id: z.string().min(1, "O id é obrigatório"),
});

export const idTarefaSchema = z.object({
    id: z.string().min(1, "O id é obrigatório"),
});