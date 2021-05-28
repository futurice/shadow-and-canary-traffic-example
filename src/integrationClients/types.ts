import { z } from 'zod';
import { animal, TAnimal } from '../index';

/**
 * The data API schema used for parsing the "responses"
 */
export const dataApiData = z.object({
  species: animal,
  name: z.string(),
  dataQuality: z.string(),
});

export type TDataApiData = z.infer<typeof dataApiData>;

export interface IDataApiClient {
  getData: (requestId: string, animal: TAnimal) => Promise<TDataApiData>;
}
