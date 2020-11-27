import GeographyService from "../geography/GeographyService";
import Lot from "../model/Lot";
import PropertyService from "../property/PropertyService";
import NeighbourhoodResult from "./NeighbourhoodResult";
import StreetResult from "./StreetResult";

export default class LotResult {
  private readonly propertySvc: PropertyService;
  private readonly geographySvc: GeographyService;
  readonly id: string;
  readonly lotNumber: number;

  constructor(propertySvc: PropertyService, geographySvc: GeographyService, lot: Lot) {
    this.propertySvc = propertySvc;
    this.geographySvc = geographySvc;
    this.id = lot.id;
    this.lotNumber = lot.lotNumber;
  }

  async street(): Promise<StreetResult> {
    const street = await this.propertySvc.getLotStreet(this.id);
    return new StreetResult(this.geographySvc, this.propertySvc, street);
  }

  async neighbourhood(): Promise<NeighbourhoodResult> {
    const neighbourhood = await this.propertySvc.getLotNeighbourhood(this.id);
    return new NeighbourhoodResult(this.geographySvc, this.propertySvc, neighbourhood);
  }
}
