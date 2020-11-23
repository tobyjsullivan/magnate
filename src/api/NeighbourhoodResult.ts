import GeographyService from "../geography/GeographyService";
import Neighbourhood from "../model/Neighbourhood";
import PropertyService from "../property/PropertyService";
import PropertyResult from "./PropertyResult";

export default class NeighbourhoodResult {
  private readonly geographySvc: GeographyService;
  private readonly propertySvc: PropertyService;
  readonly id: string;
  readonly name: string;

  constructor(geographySvc: GeographyService, propertySvc: PropertyService, neighbourhood: Neighbourhood) {
    this.geographySvc = geographySvc;
    this.propertySvc = propertySvc;
    this.id = neighbourhood.id;
    this.name = neighbourhood.name;
  }

  async properties(): Promise<ReadonlyArray<PropertyResult>> {
    const properties = await this.propertySvc.findPropertiesByNeighbourhood(this.id);
    return properties.map(prop => new PropertyResult(this.propertySvc, this.geographySvc, prop));
  }
}
