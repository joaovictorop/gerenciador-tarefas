import type { Tarefa } from "./tarefa.types";

// O globalThis preserva a lista durante o hot reload e entre a rota da API e o SSR da página.
const globalTarefas = globalThis as unknown as {
    tarefas?: Tarefa[];
};

const tarefas = (globalTarefas.tarefas ??= []);

type DadosDaTarefa = {
    titulo: string;
    descricao?: string;
};

export function listarTarefas(): Tarefa[] {
    return [...tarefas];
}

export function obterTarefa(id: string): Tarefa | undefined {
    return tarefas.find((tarefa) => tarefa.id === id);
}

export function criarTarefa(dados: DadosDaTarefa): Tarefa {
    const tarefa: Tarefa = {
        id: crypto.randomUUID(),
        titulo: dados.titulo,
        descricao: dados.descricao,
        dataCriacao: Date.now(),
    };

    tarefas.unshift(tarefa);
    return tarefa;
}

export function atualizarTarefa(
    id: string,
    novosDados: DadosDaTarefa,
): Tarefa | undefined {
    const indice = tarefas.findIndex((tarefa) => tarefa.id === id);

    if (indice === -1) {
        return undefined;
    }

    // Atribuir os campos explicitamente também permite apagar uma descrição existente.
    const atualizado = {
        ...tarefas[indice], titulo: novosDados.titulo,
        descricao: novosDados.descricao,
    };
    tarefas[indice] = atualizado;
    return atualizado;
}

export function removerTarefa(id: string): boolean {
    const indice = tarefas.findIndex((tarefa) => tarefa.id === id);

    if (indice === -1) {
        return false;
    }

    tarefas.splice(indice, 1);
    return true;
}