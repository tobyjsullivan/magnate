import {v4 as uuidv4} from 'uuid';
import Lot, { LotNumber, LotId } from '../model/Lot';
import { StreetId } from '../model/Street';

interface StreetFilter {
  street: StreetId,
  lotNumbers?: {
    start: LotNumber,
    end: LotNumber,
  },
}

interface FindLotCriteria {
  streetFilter?: StreetFilter,
}

export default class Lots {
  private readonly lotsById: Map<LotId, Lot> = new Map();

  async createLots(street: StreetId, lotNumber: LotNumber): Promise<LotId> {
    const id = uuidv4();
    const lot: Lot = {
      id,
      street,
      lotNumber,
    };
    this.lotsById.set(id, lot);
    return id;
  }

  async findLots(criteria: FindLotCriteria): Promise<ReadonlyArray<LotId>> {
    let matches: Array<Lot> = [...this.lotsById.values()];

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

  async getLots(ids: ReadonlyArray<LotId>): Promise<Map<LotId, Lot>> {
    if (ids.length === 0) {
      return new Map();
    }

    const result = new Map();
    for (const id of ids) {
      if (this.lotsById.has(id)) {
        result.set(id, this.lotsById.get(id));
      }
    }
    return result;
  }
}
