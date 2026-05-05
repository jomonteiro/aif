# AI Factory - Use Case Intake

Aplicação full-stack com:
- **Frontend:** Angular (formulário de intake e scoring)
- **Backend:** Node.js + Express
- **Base de dados:** Azure Cosmos DB (com fallback em memória para dev local)

## Executar

```bash
npm install
cp backend/.env.example backend/.env
npm run dev
```

- Frontend: http://localhost:4200
- Backend: http://localhost:3000/api/health

## Cosmos DB
Configure no `backend/.env`:
- `COSMOS_ENDPOINT`
- `COSMOS_KEY`
- `COSMOS_DATABASE`
- `COSMOS_CONTAINER`

Sem estas variáveis, os dados ficam em memória.

## Gerador de Assistentes Virtuais
A UI agora inclui uma área para:
- Colar o YAML do agente (`name` e `version`)
- Colar o Markdown do prompt
- Gerar automaticamente o ficheiro Python do cliente do agente

Endpoint:
- `POST /api/assistants/generate`
