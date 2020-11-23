import GeographyService from "../geography/GeographyService";
import Street from "../model/Street";
import PropertyService from "../property/PropertyService";
import BlockResult from "./BlockResult";

export default class StreetResult {
  private readonly geographySvc: GeographyService;
  private readonly propertySvc: PropertyService;
  readonly id: string;
  readonly name: string;

  constructor(geographySvc: GeographyService, propertySvc: PropertyService, street: Street) {
    this.geographySvc = geographySvc;
    this.propertySvc = propertySvc;
    this.id = street.id;
    this.name = street.name;
  }

  async blocks(): Promise<ReadonlyArray<BlockResult>> {
    const blocks = await this.geographySvc.getStreetBlocks(this.id);
    return blocks.map(block => new BlockResult(this.geographySvc, this.propertySvc, block));
  }
}
