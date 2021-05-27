import { performance } from 'perf_hooks';
import { TAnimal } from './index';
import { TDataApiData } from './integrationClients/types';

/**
 * Use performance.now() to create timestamps that can be used
 * for logging operation times. Returns the value in milliseconds.
 *
 * Note that we are by no means actually interested in nanosecond
 * level accuracy, but simply a ballpark.
 */
export const timestamp = () => {
  return performance.now();
};

/**
 * Add a random delay to mocked API calls to simulate network latency.
 */
export const randomTimeoutValue = (maxTimeoutMs: number) =>
  Math.floor(Math.random() * maxTimeoutMs);

/**
 * A mock "API call" to a data API that adds some delay to simulate
 * network latency.
 */
export const getAnimalWithDelay = (
  delayMs: number,
  animal: TAnimal,
  dataSource: TDataApiData[],
): Promise<TDataApiData> =>
  new Promise(resolve =>
    setTimeout(() => {
      // Normally this kind of type casting isn't safe, but for the sake of
      // our example it will do. In the wild you would rather go with something
      // along the lines of "parse, don't validate", such as we do at the HTTP
      // layer with Zod.
      resolve(
        dataSource.find(d => d.species === animal) as unknown as TDataApiData,
      );
    }, delayMs),
  );

/**
 * Get a random value between 0-99.
 */
export const randomThresholdValue = () => Math.floor(Math.random() * 100);
