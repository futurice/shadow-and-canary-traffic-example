import { TAnimal } from '../index';
import { timestamp, randomTimeoutValue, getAnimalWithDelay } from '../utils';
import { IDataApiClient, TDataApiData } from './types';

/**
 * This is where HTTP requests to the New Data API would be made.
 * Here we just simulate it.
 */
export const newDataApiClient: IDataApiClient = {
  async getData(requestId: string, animal: TAnimal) {
    const startTime = timestamp();

    console.log(
      `requestId: ${requestId} – START: Requesting animal ${animal} from New Data API`,
    );

    const data = await getAnimalWithDelay(
      randomTimeoutValue(4_000),
      animal,
      newMockData,
    );

    const endTime = timestamp();

    console.log(
      `requestId: ${requestId} – REPORT: Getting animal ${animal} took ${
        endTime - startTime
      } ms from New Data API`,
    );

    return data;
  },
};

/**
 * Define some mock data for the API. Definitely much fresher data!
 */
const newMockData: TDataApiData[] = [
  {
    species: 'cat',
    name: 'Maisa',
    dataQuality:
      'Fresh, I just saw a picture of Maisa napping on my fathers lap with no cares',
  },
  {
    species: 'dog',
    name: 'Teppo',
    dataQuality: 'Teppo was recently trimmed and looks like a whole other dog!',
  },
];
