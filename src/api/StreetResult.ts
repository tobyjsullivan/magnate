import GeographyService from "../geography/GeographyService";
import Street from "../model/Street";
import BlockResult from "./BlockResult";
import EntityResultFactory from "./EntityResultFactory";

export default class StreetResult {
  private readonly geographySvc: GeographyService;
  private readonly entityResultFactory: EntityResultFactory;

  readonly id: string;
  readonly name: string;

  constructor(geographySvc: GeographyService, entityResultFactory: EntityResultFactory, street: Street) {
    this.geographySvc = geographySvc;
    this.entityResultFactory = entityResultFactory;

    this.id = street.id;
    this.name = street.name;
  }

  async blocks(): Promise<ReadonlyArray<BlockResult>> {
    const blocks = await this.geographySvc.getStreetBlocks(this.id);
    return blocks.map(block => this.entityResultFactory.createBlockResult(block));
  }
}
