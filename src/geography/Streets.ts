import {v4 as uuidv4} from 'uuid';
import Street, { StreetId } from '../model/Street';

export default class Streets {
  private readonly streetsById: Map<StreetId, Street> = new Map();

  async createStreet(name: string): Promise<StreetId> {
    const id = uuidv4();
    const street: Street = {
      id,
      name,
    };
    this.streetsById.set(id, street);
    return id;
  }

  async findStreets(): Promise<ReadonlyArray<StreetId>> {
    return [...this.streetsById.keys()];
  }

  async getStreets(ids: ReadonlyArray<StreetId>): Promise<Map<StreetId, Street>> {
    if (ids.length === 0) {
      return new Map();
    }

    const result = new Map();
    for (const id of ids) {
      if (this.streetsById.has(id)) {
        result.set(id, this.streetsById.get(id));
      }
    }
    return result;
  }
}
