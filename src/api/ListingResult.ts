import GeographyService from "../geography/GeographyService";
import Listing from "../model/Listing";
import PropertyService from "../property/PropertyService";
import LotResult from "./LotResult";

export default class ListingResult {
  private readonly geographySvc: GeographyService;
  private readonly propertySvc: PropertyService;

  readonly id: string;
  readonly askingPrice: number;
  private readonly lotId: string;

  constructor(geographySvc: GeographyService, propertySvc: PropertyService, listing: Listing) {
    this.geographySvc = geographySvc;
    this.propertySvc = propertySvc;

    this.id = listing.id;
    this.lotId = listing.lot;
    this.askingPrice = listing.askingPrice;
  }

  async lot(): Promise<LotResult> {
    const lots = await this.propertySvc.getLots([this.lotId]);
    const lot = lots.get(this.lotId);
    return new LotResult(this.propertySvc, this.geographySvc, lot);
  }
}
