import GeographyService from "../geography/GeographyService";
import PropertyService from "../property/PropertyService";
import Worker from "./Worker";

const LOT_CONSTRUCTION_INTERVAL_MILLIS = 5 * 1000;

// Builds new lots
export default class ConstructionWorker extends Worker {
  private readonly geographySvc: GeographyService;
  private readonly propertySvc: PropertyService;
  private nextConstruction: number;

  constructor(geographySvc: GeographyService, propertySvc: PropertyService) {
    super();
    this.geographySvc = geographySvc;
    this.propertySvc = propertySvc;
    this.nextConstruction = new Date().getTime();
  }

  protected async tick() {
    if (new Date().getTime() < this.nextConstruction) {
      return;
    }

    // Pick a random block in a random neighbourhood
    const neighbourhoods = await this.geographySvc.findAllNeighbourhoods();
    const neighbourhoodIdx = Math.floor(Math.random() * neighbourhoods.length);
    const neighbourhood = neighbourhoods[neighbourhoodIdx];
    const blocks = await this.geographySvc.getNeighbourhoodBlocks(neighbourhood.id);
    if (blocks.length === 0) {
      throw new Error(`No blocks in chosen neighbourhood: ${neighbourhood.id}`)
    }
    const blockIdx = Math.floor(Math.random() * blocks.length);
    const block = blocks[blockIdx];
    console.log(`Picked block IDX ${blockIdx} which is ${block.id}`);

    const lotNum = block.startNumber + Math.round(Math.random() * (block.endNumber - block.startNumber));

    const lotId = await this.propertySvc.createLot(block.street, lotNum);
    console.log(`Created new lot: ${lotId}`);

    this.nextConstruction += LOT_CONSTRUCTION_INTERVAL_MILLIS;
  }
}
