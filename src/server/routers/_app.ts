import { router } from "../trpc";
import { tarefaRouter } from "../tarefas/tarefa.router";

export const appRouter = router({
  tarefa: tarefaRouter,
});

export type AppRouter = typeof appRouter;