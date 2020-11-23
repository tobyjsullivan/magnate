import {v4 as uuidv4} from 'uuid';
import Neighbourhood, { NeighbourhoodId } from '../model/Neighbourhood';

export default class Neighbourhoods {
  private readonly hoodsById: Map<NeighbourhoodId, Neighbourhood> = new Map();

  async createNeighbourhood(name: string): Promise<NeighbourhoodId> {
    const id = uuidv4();
    const neighbourhood: Neighbourhood = {
      id,
      name,
    };
    this.hoodsById.set(id, neighbourhood);
    return id;
  }

  async findNeighbourhoods(): Promise<ReadonlyArray<NeighbourhoodId>> {
    return [...this.hoodsById.keys()];
  }

  async getNeighbourhoods(ids: ReadonlyArray<NeighbourhoodId>): Promise<ReadonlyMap<NeighbourhoodId, Neighbourhood>> {
    if (ids.length === 0) {
      return new Map();
    }

    const result: Map<string, Neighbourhood> = new Map();
    for (const id of ids) {
      if (this.hoodsById.has(id)) {
        result.set(id, this.hoodsById.get(id));
      }
    }
    return result;
  }
}
