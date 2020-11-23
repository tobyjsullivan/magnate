import GeographyService from "../geography/GeographyService";
import Block from "../model/Block";
import PropertyService from "../property/PropertyService";
import NeighbourhoodResult from "./NeighbourhoodResult";
import StreetResult from "./StreetResult";

export default class BlockResult {
  private readonly geographySvc: GeographyService;
  private readonly propertySvc: PropertyService;
  readonly id: string;
  readonly startNumber: number;
  readonly endNumber: number;

  constructor(geographySvc: GeographyService, propertySvc: PropertyService, block: Block) {
    this.geographySvc = geographySvc;
    this.propertySvc = propertySvc;
    this.id = block.id;
    this.startNumber = block.startNumber;
    this.endNumber = block.endNumber;
  }

  async street(): Promise<StreetResult> {
    const street = await this.geographySvc.getBlockStreet(this.id);
    return new StreetResult(this.geographySvc, this.propertySvc, street);
  }

  async neighbourhood(): Promise<NeighbourhoodResult> {
    const neighbourhood = await this.geographySvc.getBlockNeighbourhood(this.id);
    return new NeighbourhoodResult(this.geographySvc, this.propertySvc, neighbourhood);
  }
}
