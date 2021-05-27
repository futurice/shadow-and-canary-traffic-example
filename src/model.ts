/**
 * This is the model containing the (in this example very simple) business
 * logic. For example data from different sources would be fetched and combined
 * here.
 */
import { TRequest } from './index';
import { oldDataApiClient } from './integrationClients/oldDataApiClient';
import { newDataApiClient } from './integrationClients/newDataApiClient';
import { TDataApiData } from './integrationClients/types';

const SHADOW_TRAFFIC_ENABLED = process.env.SHADOW_TRAFFIC_ENABLED === 'true';

export const handleDataRequest = (
  requestId: string,
  { animal }: TRequest,
): Promise<TDataApiData> => {
  /**
   * If the runtime configuration says so, we make a shadow request to the New
   * Data API. Note that this operation isn't blocking! I.e. if the API call
   * below is faster, this doesn't need to be awaited on. Also, since this
   * happens within the function scope and no external references are created,
   * this will be nicely garbage collected, and no memory leaks are created.
   */
  if (SHADOW_TRAFFIC_ENABLED) {
    newDataApiClient.getData(requestId, animal);
  }

  /**
   * We get the data from the Old Data API and return that to the client.
   * This line doesn't really care if the request above is made or not.
   */
  return oldDataApiClient.getData(requestId, animal);
};
