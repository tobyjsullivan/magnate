import GeographyService from "../geography/GeographyService";
import Neighbourhood from "../model/Neighbourhood";
import PropertyService from "../property/PropertyService";
import LotResult from "./LotResult";

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

  async lots(): Promise<ReadonlyArray<LotResult>> {
    const lots = await this.propertySvc.findLotsByNeighbourhood(this.id);
    return lots.map(lot => new LotResult(this.propertySvc, this.geographySvc, lot));
  }
}
