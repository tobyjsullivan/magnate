import Lot from "../model/Lot";
import PlayerService from "../players/PlayerService";
import LandTitleRegistry from "../property/LandTitleRegistry";
import PropertyService from "../property/PropertyService";
import EntityResultFactory from "./EntityResultFactory";
import NeighbourhoodResult from "./NeighbourhoodResult";
import PlayerResult from "./PlayerResult";
import StreetResult from "./StreetResult";

export default class LotResult {
  private readonly propertySvc: PropertyService;
  private readonly landTitleRegistry: LandTitleRegistry;
  private readonly playerSvc: PlayerService;
  private readonly entityResultFactory: EntityResultFactory;

  readonly id: string;
  readonly lotNumber: number;

  constructor(propertySvc: PropertyService, landTitleRegistry: LandTitleRegistry, playerSvc: PlayerService, entityResultFactory: EntityResultFactory, lot: Lot) {
    this.propertySvc = propertySvc;
    this.landTitleRegistry = landTitleRegistry;
    this.playerSvc = playerSvc;
    this.entityResultFactory = entityResultFactory;

    this.id = lot.id;
    this.lotNumber = lot.lotNumber;
  }

  async street(): Promise<StreetResult> {
    const street = await this.propertySvc.getLotStreet(this.id);
    return this.entityResultFactory.createStreetResult(street);
  }

  async owner(): Promise<PlayerResult | undefined> {
    const ownerId = await this.landTitleRegistry.searchOwner(this.id);
    if (!ownerId) {
      return undefined;
    }
    const players = await this.playerSvc.getPlayers([ownerId]);
    const owner = players.get(ownerId);
    return this.entityResultFactory.createPlayerResult(owner);
  }

  async neighbourhood(): Promise<NeighbourhoodResult> {
    const neighbourhood = await this.propertySvc.getLotNeighbourhood(this.id);
    return this.entityResultFactory.createNeighbourhoodResult(neighbourhood);
  }
}
