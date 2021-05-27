import { TAnimal } from '../index';

export type TDataApiData = {
  species: TAnimal;
  name: string;
  dataQuality: string;
};

export interface IDataApiClient {
  getData: (requestId: string, animal: TAnimal) => Promise<TDataApiData>;
}
