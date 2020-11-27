import Neighbourhood from "../model/Neighbourhood";
import PropertyService from "../property/PropertyService";
import EntityResultFactory from "./EntityResultFactory";
import LotResult from "./LotResult";

export default class NeighbourhoodResult {
  private readonly propertySvc: PropertyService;
  private readonly entityResultFactory: EntityResultFactory;

  readonly id: string;
  readonly name: string;

  constructor(propertySvc: PropertyService, entityResultFactory: EntityResultFactory, neighbourhood: Neighbourhood) {
    this.propertySvc = propertySvc;
    this.entityResultFactory = entityResultFactory;

    this.id = neighbourhood.id;
    this.name = neighbourhood.name;
  }

  async lots(): Promise<ReadonlyArray<LotResult>> {
    const lots = await this.propertySvc.findLotsByNeighbourhood(this.id);
    return lots.map(lot => this.entityResultFactory.createLotResult(lot));
  }
}
