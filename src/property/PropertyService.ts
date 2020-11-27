import GeographyService from "../geography/GeographyService";
import Neighbourhood, { NeighbourhoodId } from "../model/Neighbourhood";
import Lot, { LotNumber, LotId } from "../model/Lot";
import Street, { StreetId } from "../model/Street";
import Lots from "./Lots";

export default class PropertyService {
  private readonly lots: Lots;
  private readonly geographySvc: GeographyService;

  constructor(lots: Lots, geographySvc: GeographyService) {
    this.lots = lots;
    this.geographySvc = geographySvc;
  }

  async createLot(street: StreetId, number: LotNumber): Promise<LotId> {
    // Check if the lot already exists
    const conflictingIds = await this.lots.findLots({
      streetFilter: {
        street,
        lotNumbers: {
          start: number,
          end: number,
        },
      },
    });
    if (conflictingIds.length > 0) {
      throw new Error(`Cannot create Lot when one already exists at that address: ${conflictingIds[0]}`);
    }

    return await this.lots.createLots(street, number);
  }

  async getLots(lotIds: LotId[]): Promise<Map<LotId, Lot>> {
    return await this.lots.getLots(lotIds);
  }

  async getLotStreet(lotId: LotId): Promise<Street> {
    const lots = await this.lots.getLots([lotId]);
    const lot = lots.get(lotId);
    const streetMap = await this.geographySvc.getStreets([lot.street]);
    return streetMap.get(lot.street);
  }

  async getLotNeighbourhood(lotId: LotId): Promise<Neighbourhood> {
    const lots = await this.lots.getLots([lotId]);
    const lot = lots.get(lotId);
    return await this.geographySvc.findNeighbourhoodByAddress(lot.street, lot.lotNumber);
  }

  async findAllLots(): Promise<ReadonlyArray<Lot>> {
    const lotIds = await this.lots.findLots({});
    const lots = await this.lots.getLots(lotIds);
    return [...lots.values()];
  }

  async findLotsByNeighbourhood(neighbourhoodId: NeighbourhoodId): Promise<ReadonlyArray<Lot>> {
    const blocks = await this.geographySvc.getNeighbourhoodBlocks(neighbourhoodId);

    const allLotIds: LotId[] = [];
    for (const block of blocks) {
      const lotIds = await this.lots.findLots({
        streetFilter: {
          street: block.street,
          lotNumbers: {
            start: block.startNumber,
            end: block.endNumber,
          },
        },
      });
      lotIds.forEach(id => allLotIds.push(id));
    }
    return [...(await this.lots.getLots(allLotIds)).values()];
  }
}
