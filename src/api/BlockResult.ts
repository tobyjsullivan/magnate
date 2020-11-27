import GeographyService from "../geography/GeographyService";
import Block from "../model/Block";
import EntityResultFactory from "./EntityResultFactory";
import NeighbourhoodResult from "./NeighbourhoodResult";
import StreetResult from "./StreetResult";

export default class BlockResult {
  private readonly geographySvc: GeographyService;
  private readonly entityResultFactory: EntityResultFactory;

  readonly id: string;
  readonly startLotNumber: number;
  readonly endLotNumber: number;

  constructor(geographySvc: GeographyService, entityResultFactory: EntityResultFactory, block: Block) {
    this.geographySvc = geographySvc;
    this.entityResultFactory = entityResultFactory;

    this.id = block.id;
    this.startLotNumber = block.startNumber;
    this.endLotNumber = block.endNumber;
  }

  async street(): Promise<StreetResult> {
    const street = await this.geographySvc.getBlockStreet(this.id);
    return this.entityResultFactory.createStreetResult(street);
  }

  async neighbourhood(): Promise<NeighbourhoodResult> {
    const neighbourhood = await this.geographySvc.getBlockNeighbourhood(this.id);
    return this.entityResultFactory.createNeighbourhoodResult(neighbourhood);
  }
}
