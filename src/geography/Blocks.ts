import {v4 as uuidv4} from 'uuid';
import Block, { BlockId } from '../model/Block';
import { NeighbourhoodId } from '../model/Neighbourhood';
import { LotNumber } from '../model/Property';
import { StreetId } from '../model/Street';

interface StreetFilter {
  street: StreetId,
  lotNumbers?: {
    start: LotNumber,
    end: LotNumber,
  },
}

interface NeighbourhoodFilter {
  neighbourhood: NeighbourhoodId,
}

interface FindBlocksCriteria {
  streetFilter?: StreetFilter,
  neighbourhoodFilter?: NeighbourhoodFilter,
}

export default class Blocks {
  private readonly blocksById: Map<BlockId, Block> = new Map();

  async createBlock(street: StreetId, neighbourhood: NeighbourhoodId, startNumber: LotNumber, endNumber: LotNumber): Promise<BlockId> {
    const id = uuidv4();
    const block: Block = {
      id,
      street,
      neighbourhood,
      startNumber,
      endNumber,
    };
    this.blocksById.set(id, block);
    return id;
  }

  async findBlocks(criteria: FindBlocksCriteria): Promise<ReadonlyArray<BlockId>> {
    let matches = [...this.blocksById.values()];

    if (criteria.neighbourhoodFilter) {
      matches = matches.filter(block => block.neighbourhood === criteria.neighbourhoodFilter.neighbourhood);
    }

    if (criteria.streetFilter) {
      const {street, lotNumbers} = criteria.streetFilter;

      matches = matches.filter(block => block.street === street);

      if (lotNumbers) {
        matches = matches.filter(block => block.endNumber >= lotNumbers.start && block.startNumber <= lotNumbers.end);
      }
    }

    return matches.map(block => block.id);
  }

  async getBlocks(ids: ReadonlyArray<BlockId>): Promise<Map<BlockId, Block>> {
    if (ids.length === 0) {
      return new Map();
    }

    const result = new Map();
    for (const id of ids) {
      if (this.blocksById.has(id)) {
        result.set(id, this.blocksById.get(id));
      }
    }
    return result;
  }
}
