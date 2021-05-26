/**
 * This is the model containing the (in this example very simple) business
 * logic. For example data from different sources would be fetched and combined
 * here.
 */
import { TRequest } from './index';
import { oldDataApiClient } from './integrationClients/oldDataApiClient';

// FIXME: return type
export const handleDataRequest = (
  requestId: string,
  { foo, animal }: TRequest,
): Promise<any> => {
  return oldDataApiClient.getData(requestId, animal);
};
