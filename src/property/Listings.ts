import {v4 as uuidv4} from 'uuid';
import Listing, { ListingId } from "../model/Listing";
import { LotId } from '../model/Lot';

interface FindListingsCriteria {
  lot?: LotId,
}

export default class Listings {
  private readonly listingsById: Map<ListingId, Listing> = new Map();

  async createListing(lot: LotId, askingPrice: number): Promise<ListingId> {
    const id = uuidv4();
    const listing: Listing = {
      id,
      lot: lot,
      askingPrice,
    };
    this.listingsById.set(id, listing);
    return id;
  }

  async findListings(criteria: FindListingsCriteria): Promise<ReadonlyArray<ListingId>> {
    let matches = [...this.listingsById.values()];
    if (criteria.lot) {
      matches = matches.filter(listing => listing.lot === criteria.lot);
    }

    return matches.map(listing => listing.id);
  }

  async getListings(ids: ReadonlyArray<ListingId>): Promise<Map<ListingId, Listing>> {
    const result = new Map();
    for (const listingId of ids) {
      if (this.listingsById.has(listingId)) {
        result.set(listingId, this.listingsById.get(listingId));
      }
    }

    return result;
  }
}
