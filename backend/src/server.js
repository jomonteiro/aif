import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { randomUUID } from 'node:crypto';
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import yaml from 'js-yaml';
import { getContainer } from './cosmos.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

const mem = [];
const AGENT_ENDPOINT = 'https://maftests.services.ai.azure.com/api/projects/mafTestProject';

function buildAgentClientCode(agentName, agentVersion) {
  return `# AUTO-GENERATED FILE - DO NOT EDIT\n\nfrom azure.identity import DefaultAzureCredential\nfrom azure.ai.projects import AIProjectClient\n\nendpoint = "${AGENT_ENDPOINT}"\n\nproject_client = AIProjectClient(\n    endpoint=endpoint,\n    credential=DefaultAzureCredential(),\n)\n\nAGENT_NAME = "${agentName}"\nAGENT_VERSION = "${agentVersion}"\n\nopenai_client = project_client.get_openai_client(\n    api_version="2024-05-01-preview"\n)\n\ndef run_agent(user_input: str):\n    response = openai_client.responses.create(\n        input=[{"role": "user", "content": user_input}],\n        extra_body={\n            "agent_reference": {\n                "name": AGENT_NAME,\n                "version": AGENT_VERSION,\n                "type": "agent_reference"\n            }\n        },\n    )\n    return response.output_text\n\n\nif __name__ == "__main__":\n    print(run_agent("Tell me what you can help with."))\n`;
}

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.post('/api/usecases', async (req, res) => {
  const item = { id: randomUUID(), createdAt: new Date().toISOString(), ...req.body };
  const container = getContainer();
  if (container) await container.items.create(item); else mem.push(item);
  res.status(201).json(item);
});

app.get('/api/usecases', async (_req, res) => {
  const container = getContainer();
  if (container) {
    const { resources } = await container.items.query('SELECT * FROM c ORDER BY c.createdAt DESC').fetchAll();
    return res.json(resources);
  }
  res.json(mem);
});

app.post('/api/assistants/generate', async (req, res) => {
  try {
    const { agentYaml, promptMd } = req.body;
    const parsed = yaml.load(agentYaml);
    const agentName = parsed?.name;
    const agentVersion = parsed?.version;
    if (!agentName || !agentVersion) return res.status(400).json({ error: 'YAML deve conter name e version.' });

    const outputDir = path.resolve('backend/src/assistant-generator/output');
    await mkdir(outputDir, { recursive: true });
    const pyCode = buildAgentClientCode(agentName, agentVersion);
    const pyPath = path.join(outputDir, `${agentName}_client.py`);
    await writeFile(pyPath, pyCode, 'utf-8');
    if (promptMd) await writeFile(path.join(outputDir, `${agentName}.md`), promptMd, 'utf-8');

    res.status(201).json({ agentName, agentVersion, pyCode, outputFile: pyPath });
  } catch (e) {
    res.status(500).json({ error: `Erro a gerar agente: ${e.message}` });
  }
});

app.listen(process.env.PORT || 3000, () => console.log('API running on 3000'));
