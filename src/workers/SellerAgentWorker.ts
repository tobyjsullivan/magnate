import Lot from "../model/Lot";
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
    // Check if we need to list any new lots.
    const allListings = await this.listingSvc.findAllListings();
    if (allListings.length >= NUM_DESIRED_LISTINGS) {
      return;
    }

    const listingsByLotId = new Map();
    for (const listing of allListings) {
      listingsByLotId.set(listing.lot, listing);
    }

    // Need to create at least one more listings.
    // Find a lot that is unowned.
    const lots = await this.propertySvc.findAllLots();
    let lotToList = undefined;
    for (const lot of lots) {
      const owner = await this.landTitleRegistry.searchOwner(lot.id);
      if (owner === undefined && !listingsByLotId.has(lot.id)) {
        lotToList = lot;
        break;
      }
    }
    if (lotToList !== undefined) {
      // Create the listing
      const value = this.assessLotValue(lotToList);
      const listingId = await this.listingSvc.createListing(lotToList.id, value);
      console.log(`Created listing: ${listingId}`);
    }

    // We only create one listing per tick.
  }

  private assessLotValue(lot: Lot): number {
    // TODO
    return 200000.00;
  }
}
