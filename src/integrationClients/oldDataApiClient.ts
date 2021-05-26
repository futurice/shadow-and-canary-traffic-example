import { TAnimal } from '../index';
import { timestamp } from '../timestamp';

/**
 * This is where HTTP requests to the Old Data API would be made.
 * Here we just simulate it.
 */
export const oldDataApiClient = {
  async getData(requestId: string, animal: TAnimal) {
    const startTime = timestamp();

    const data = await getAnimalWithDelay(randomTimeoutValue(), animal);

    const endTime = timestamp();

    console.log(
      `requestId: ${requestId} – Getting animal ${animal} took ${
        endTime - startTime
      } ms from Old Data API`,
    );

    return data;
  },
};

const randomTimeoutValue = () => Math.floor(Math.random() * 5_000);

const getAnimalWithDelay = (delayMs: number, animal: TAnimal) =>
  new Promise(resolve =>
    setTimeout(() => {
      resolve(oldMockData.find(d => d.species === animal));
    }, delayMs),
  );

const oldMockData = [
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
