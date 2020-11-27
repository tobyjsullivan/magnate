import GeographyService from "../geography/GeographyService";
import Block from "../model/Block";
import Listing from "../model/Listing";
import Lot from "../model/Lot";
import Neighbourhood from "../model/Neighbourhood";
import Player from "../model/Player";
import Street from "../model/Street";
import PlayerService from "../players/PlayerService";
import LandTitleRegistry from "../property/LandTitleRegistry";
import PropertyService from "../property/PropertyService";
import BlockResult from "./BlockResult";
import ListingResult from "./ListingResult";
import LotResult from "./LotResult";
import NeighbourhoodResult from "./NeighbourhoodResult";
import PlayerResult from "./PlayerResult";
import StreetResult from "./StreetResult";

export default class EntityResultFactory {
  private readonly geographySvc: GeographyService;
  private readonly propertySvc: PropertyService;
  private readonly playerSvc: PlayerService;
  private readonly landTitleRegistry: LandTitleRegistry;

  constructor(geographySvc: GeographyService, propertySvc: PropertyService, playerSvc: PlayerService, landTitleRegistry: LandTitleRegistry) {
    this.geographySvc = geographySvc;
    this.propertySvc = propertySvc;
    this.playerSvc = playerSvc;
    this.geographySvc = geographySvc;
    this.landTitleRegistry = landTitleRegistry;
  }

  createBlockResult(block: Block): BlockResult {
    return new BlockResult(this.geographySvc, this, block);
  }

  createListingResult(listing: Listing): ListingResult {
    return new ListingResult(this.propertySvc, this, listing);
  }

  createLotResult(lot: Lot): LotResult {
    return new LotResult(this.propertySvc, this.landTitleRegistry, this.playerSvc, this, lot);
  }

  createNeighbourhoodResult(neighbourhood: Neighbourhood): NeighbourhoodResult {
    return new NeighbourhoodResult(this.propertySvc, this, neighbourhood);
  }

  createPlayerResult(player: Player): PlayerResult {
    return new PlayerResult(player);
  }

  createStreetResult(street: Street): StreetResult {
    return new StreetResult(this.geographySvc, this, street);
  }
}
