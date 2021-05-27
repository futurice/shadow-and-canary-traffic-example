/**
 * This is the model containing the (in this example very simple) business
 * logic. For example data from different sources would be fetched and combined
 * here.
 */
import { TAnimal } from './index';
import { oldDataApiClient } from './integrationClients/oldDataApiClient';
import { newDataApiClient } from './integrationClients/newDataApiClient';
import { TDataApiData } from './integrationClients/types';
import { randomThresholdValue } from './utils';

const SHADOW_TRAFFIC_ENABLED = process.env.SHADOW_TRAFFIC_ENABLED === 'true';

/**
 * This function includes the shadow traffic "side channel" in addition to
 * the "main channel".
 */
export const handleDataRequestWithShadowTraffic = (
  requestId: string,
  animal: TAnimal,
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

const CANARY_THRESHOLD_PERCENT = parseInt(
  process.env.CANARY_THRESHOLD_PERCENT || '0',
);

/**
 * This function divides the traffic between Old Data API and New Data API
 * based on the runtime configuration of CANARY_THRESHOLD_PERCENT.
 */
export const handleDataRequestWithCanaryTraffic = (
  requestId: string,
  animal: TAnimal,
): Promise<TDataApiData> => {
  const randomValue = randomThresholdValue();
  console.log(
    `requestId: ${requestId} – DEBUG: random value = ${randomValue}, CANARY_THRESHOLD_PERCENT = ${CANARY_THRESHOLD_PERCENT}`,
  );

  if (CANARY_THRESHOLD_PERCENT > randomValue) {
    /**
     * If CANARY_THRESHOLD_PERCENT is higher than the random value (0-99), make
     * the request to New Data API. Therefore if CANARY_THRESHOLD_PERCENT === 100,
     * all request are made to New Data API.
     */
    return newDataApiClient.getData(requestId, animal);
  } else {
    /**
     * If CANARY_THRESHOLD_PERCENT is lower than or equal to the random value (0-99),
     * make the request to Old Data API. Therefore if CANARY_THRESHOLD_PERCENT === 0,
     * all request are made to Old Data API.
     */
    return oldDataApiClient.getData(requestId, animal);
  }
};
