import Listing, { ListingId } from "../model/Listing";
import { PropertyId } from "../model/Property";
import Listings from "./Listings";

export default class ListingService {
  private readonly listings: Listings;

  constructor(listings: Listings) {
    this.listings = listings;
  }

  async createListing(property: PropertyId, askingPrice: number): Promise<ListingId> {
    // Check if a listing already exists for this property
    const found = await this.listings.findListings({property});
    if (found.length > 0) {
      throw new Error(`Listing already exists for property: ${property}`);
    }

    return await this.listings.createListing(property, askingPrice);
  }

  async findAllListings(): Promise<ReadonlyArray<Listing>> {
    const listingIds = await this.listings.findListings({});
    const listings = await this.listings.getListings(listingIds);
    return [...listings.values()];
  }
}
