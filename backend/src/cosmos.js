import { CosmosClient } from '@azure/cosmos';

export function getContainer() {
  const endpoint = process.env.COSMOS_ENDPOINT;
  const key = process.env.COSMOS_KEY;
  const databaseId = process.env.COSMOS_DATABASE || 'aif';
  const containerId = process.env.COSMOS_CONTAINER || 'usecases';
  if (!endpoint || !key) return null;
  const client = new CosmosClient({ endpoint, key });
  return client.database(databaseId).container(containerId);
}
