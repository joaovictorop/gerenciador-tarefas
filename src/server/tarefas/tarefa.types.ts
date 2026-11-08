export type Tarefa = {
  id: string;
  titulo: string;
  descricao?: string;
  // Number evita que um Date precise de transformer para chegar corretamente ao frontend.
  dataCriacao: number;
};