import {v4 as uuidv4} from 'uuid';
import Property, { LotNumber as LotNumber, PropertyId } from '../model/Property';
import { StreetId } from '../model/Street';

interface StreetFilter {
  street: StreetId,
  lotNumbers?: {
    start: LotNumber,
    end: LotNumber,
  },
}

interface FindPropertyCriteria {
  streetFilter?: StreetFilter,
}

export default class Properties {
  private readonly propertiesById: Map<PropertyId, Property> = new Map();

  async createProperty(street: StreetId, lotNumber: LotNumber): Promise<PropertyId> {
    const id = uuidv4();
    const property: Property = {
      id,
      street,
      lotNumber,
    };
    this.propertiesById.set(id, property);
    return id;
  }

  async findProperties(criteria: FindPropertyCriteria): Promise<ReadonlyArray<PropertyId>> {
    let matches: Array<Property> = [...this.propertiesById.values()];

    const {streetFilter} = criteria;
    if (streetFilter) {
      matches = matches.filter(prop => prop.street === streetFilter.street);

      if (streetFilter.lotNumbers) {
        const {start, end} = streetFilter.lotNumbers;
        matches = matches.filter(prop => prop.lotNumber >= start && prop.lotNumber <= end);
      }
    }

    return matches.map(prop => prop.id);
  }

  async getProperties(ids: ReadonlyArray<PropertyId>): Promise<Map<PropertyId, Property>> {
    if (ids.length === 0) {
      return new Map();
    }

    const result = new Map();
    for (const id of ids) {
      if (this.propertiesById.has(id)) {
        result.set(id, this.propertiesById.get(id));
      }
    }
    return result;
  }
}
