import GeographyService from "../geography/GeographyService";
import Listing from "../model/Listing";
import PropertyService from "../property/PropertyService";
import EntityResultFactory from "./EntityResultFactory";
import LotResult from "./LotResult";

export default class ListingResult {
  private readonly propertySvc: PropertyService;
  private readonly entityResultFactory: EntityResultFactory;

  readonly id: string;
  readonly askingPrice: number;
  private readonly lotId: string;

  constructor(propertySvc: PropertyService, entityResultFactory: EntityResultFactory, listing: Listing) {
    this.propertySvc = propertySvc;
    this.entityResultFactory = entityResultFactory;

    this.id = listing.id;
    this.lotId = listing.lot;
    this.askingPrice = listing.askingPrice;
  }

  async lot(): Promise<LotResult> {
    const lots = await this.propertySvc.getLots([this.lotId]);
    const lot = lots.get(this.lotId);
    return this.entityResultFactory.createLotResult(lot);
  }
}
