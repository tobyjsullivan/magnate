import Property from "../model/Property";
import ListingService from "../property/ListingService";
import PropertyService from "../property/PropertyService";
import LandTitleRegistry from "../property/LandTitleRegistry";
import Worker from "./Worker";

const NUM_DESIRED_LISTINGS = 25;

export default class SellerAgentWorker extends Worker {
  private readonly propertySvc: PropertyService;
  private readonly listingSvc: ListingService;
  private readonly landTitleRegistry: LandTitleRegistry;

  constructor(propertySvc: PropertyService, listingSvc: ListingService, landTitleRegistry: LandTitleRegistry) {
    super();
    this.propertySvc = propertySvc;
    this.listingSvc = listingSvc;
    this.landTitleRegistry = landTitleRegistry;
  }

  async tick() {
    // Check if we need to list any new properties.
    const allListings = await this.listingSvc.findAllListings();
    if (allListings.length >= NUM_DESIRED_LISTINGS) {
      return;
    }

    const listingsByPropertyId = new Map();
    for (const listing of allListings) {
      listingsByPropertyId.set(listing.property, listing);
    }

    // Need to create at least one more listings.
    // Find a property that is unowned.
    const properties = await this.propertySvc.findAllProperties();
    let propertyToList = undefined;
    for (const property of properties) {
      const owner = await this.landTitleRegistry.searchOwner(property.id);
      if (owner === undefined && !listingsByPropertyId.has(property.id)) {
        propertyToList = property;
        break;
      }
    }
    if (propertyToList !== undefined) {
      // Create the listing
      const value = this.assessPropertyValue(propertyToList);
      const listingId = await this.listingSvc.createListing(propertyToList.id, value);
      console.log(`Created listing: ${listingId}`);
    }

    // We only create one listing per tick.
  }

  private assessPropertyValue(property: Property): number {
    // TODO
    return 200000.00;
  }
}
