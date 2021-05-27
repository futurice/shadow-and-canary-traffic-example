import { TAnimal } from '../index';
import { timestamp, randomTimeoutValue, getAnimalWithDelay } from '../utils';
import { IDataApiClient, TDataApiData } from './types';

/**
 * This is where HTTP requests to the Old Data API would be made.
 * Here we just simulate it.
 */
export const oldDataApiClient: IDataApiClient = {
  async getData(requestId: string, animal: TAnimal) {
    const startTime = timestamp();

    console.log(
      `requestId: ${requestId} – START: Requesting animal ${animal} from Old Data API`,
    );

    const data = await getAnimalWithDelay(
      randomTimeoutValue(5_000),
      animal,
      oldMockData,
    );

    const endTime = timestamp();

    console.log(
      `requestId: ${requestId} – REPORT: Getting animal ${animal} took ${
        endTime - startTime
      } ms from Old Data API`,
    );

    return data;
  },
};

/**
 * Define some mock data for the API. Note how the data is old ;)
 */
const oldMockData: TDataApiData[] = [
  {
    species: 'cat',
    name: 'Maisa',
    dataQuality: 'Old, not that fancy.',
  },
  {
    species: 'dog',
    name: 'Teppo',
    dataQuality:
      "Haven't seen Teppo in a long time so can't be sure ¯\\_(ツ)_/¯",
  },
];
