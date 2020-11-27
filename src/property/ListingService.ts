import Listing, { ListingId } from "../model/Listing";
import { LotId } from "../model/Lot";
import Listings from "./Listings";

export default class ListingService {
  private readonly listings: Listings;

  constructor(listings: Listings) {
    this.listings = listings;
  }

  async createListing(lot: LotId, askingPrice: number): Promise<ListingId> {
    // Check if a listing already exists for this property
    const found = await this.listings.findListings({lot: lot});
    if (found.length > 0) {
      throw new Error(`Listing already exists for property: ${lot}`);
    }

    return await this.listings.createListing(lot, askingPrice);
  }

  async findAllListings(): Promise<ReadonlyArray<Listing>> {
    const listingIds = await this.listings.findListings({});
    const listings = await this.listings.getListings(listingIds);
    return [...listings.values()];
  }
}
