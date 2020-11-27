import GeographyService from "../geography/GeographyService";
import Listing from "../model/Listing";
import PropertyService from "../property/PropertyService";
import PropertyResult from "./PropertyResult";

export default class ListingResult {
  private readonly geographySvc: GeographyService;
  private readonly propertySvc: PropertyService;

  readonly id: string;
  readonly askingPrice: number;
  private readonly propertyId: string;

  constructor(geographySvc: GeographyService, propertySvc: PropertyService, listing: Listing) {
    this.geographySvc = geographySvc;
    this.propertySvc = propertySvc;

    this.id = listing.id;
    this.propertyId = listing.property;
    this.askingPrice = listing.askingPrice;
  }

  async property(): Promise<PropertyResult> {
    const properties = await this.propertySvc.getProperties([this.propertyId]);
    const property = properties.get(this.propertyId);
    return new PropertyResult(this.propertySvc, this.geographySvc, property);
  }
}
