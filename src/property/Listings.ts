import {v4 as uuidv4} from 'uuid';
import Listing, { ListingId } from "../model/Listing";
import { PropertyId } from '../model/Property';

interface FindListingsCriteria {
  property?: PropertyId,
}

export default class Listings {
  private readonly listingsById: Map<ListingId, Listing> = new Map();

  async createListing(property: PropertyId, askingPrice: number): Promise<ListingId> {
    const id = uuidv4();
    const listing: Listing = {
      id,
      property,
      askingPrice,
    };
    this.listingsById.set(id, listing);
    return id;
  }

  async findListings(criteria: FindListingsCriteria): Promise<ReadonlyArray<ListingId>> {
    let matches = [...this.listingsById.values()];
    if (criteria.property) {
      matches = matches.filter(listing => listing.property === criteria.property);
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
