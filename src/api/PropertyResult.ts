import GeographyService from "../geography/GeographyService";
import Property from "../model/Property";
import PropertyService from "../property/PropertyService";
import NeighbourhoodResult from "./NeighbourhoodResult";
import StreetResult from "./StreetResult";

export default class PropertyResult {
  private readonly propertySvc: PropertyService;
  private readonly geographySvc: GeographyService;
  readonly id: string;
  readonly buildingNumber: number;
  readonly unit?: string;

  constructor(propertySvc: PropertyService, geographySvc: GeographyService, property: Property) {
    this.propertySvc = propertySvc;
    this.geographySvc = geographySvc;
    this.id = property.id;
    this.buildingNumber = property.buildingNumber;
    this.unit = property.unit;
  }

  async street(): Promise<StreetResult> {
    const street = await this.propertySvc.getPropertyStreet(this.id);
    return new StreetResult(this.geographySvc, this.propertySvc, street);
  }

  async neighbourhood(): Promise<NeighbourhoodResult> {
    const neighbourhood = await this.propertySvc.getPropertyNeighbourhood(this.id);
    return new NeighbourhoodResult(this.geographySvc, this.propertySvc, neighbourhood);
  }
}