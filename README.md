# Gerenciador de Tarefas

Aplicação web para criar, listar, editar e remover tarefas. O projeto usa
renderização no servidor para carregar a lista inicial e tRPC para conectar a
interface às operações do servidor.

## Tecnologias

- Next.js 15 (App Router)
- tRPC v11
- TanStack Query
- Zod
- TypeScript

## Como executar

Pré-requisito: Node.js 20 ou superior.

```bash
git clone https://github.com/joaovictorop/gerenciador-tarefas
cd gerenciador-tarefas
npm install
npm run dev
```

Acesse http://localhost:3000.

## Estrutura

```text
src/
├── app/          # páginas e componentes
├── server/       # tRPC: routers, schemas e armazenamento
└── trpc/         # configuração do cliente e do servidor
```

## Decisões

Os dados ficam em memória usando `globalThis`, mantendo a implementação
simples e sem exigir um banco de dados para este case. A home usa SSR com
`force-dynamic`, para buscar a lista atualizada a cada requisição. Os dados
são validados no formulário antes do envio e novamente no backend com Zod. Os
erros de domínio usam `TRPCError`, com códigos apropriados como `NOT_FOUND`.

## Limitações

Os dados somem quando o servidor é reiniciado, pois ainda não existe uma
persistência em banco de dados. O infinite scroll, item bônus, não foi
implementado e fica como próxima melhoria.
