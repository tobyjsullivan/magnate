import {RequestHandler} from 'express';
import { graphqlHTTP } from 'express-graphql';
import GeographyService from '../geography/GeographyService';
import Neighbourhood from '../model/Neighbourhood';
import Lot from '../model/Lot';
import ListingService from '../property/ListingService';
import PropertyService from '../property/PropertyService';
import ListingResult from './ListingResult';
import NeighbourhoodResult from './NeighbourhoodResult';
import LotResult from './LotResult';
import { schema } from './Schema';
import EntityResultFactory from './EntityResultFactory';
import PlayerResult from './PlayerResult';
import PlayerService from '../players/PlayerService';

export default class ApiHandlerFactory {
  private readonly geographySvc: GeographyService;
  private readonly propertySvc: PropertyService;
  private readonly listingSvc: ListingService;
  private readonly playerSvc: PlayerService;
  private readonly entityResultFactory: EntityResultFactory;

  constructor(geographySvc: GeographyService, propertySvc: PropertyService, listingSvc: ListingService, playerSvc: PlayerService, entityResultFactory: EntityResultFactory) {
    this.geographySvc = geographySvc;
    this.propertySvc = propertySvc;
    this.listingSvc = listingSvc;
    this.playerSvc = playerSvc;
    this.entityResultFactory = entityResultFactory;
  }

  buildHandler(): RequestHandler {
    const root = {
      allNeighbourhoods: async ({}): Promise<ReadonlyArray<NeighbourhoodResult>> => {
        const hoods: ReadonlyArray<Neighbourhood> = await this.geographySvc.findAllNeighbourhoods();
        return hoods.map(hood => this.entityResultFactory.createNeighbourhoodResult(hood));
      },
      allLots: async ({}): Promise<ReadonlyArray<LotResult>> => {
        const lots: ReadonlyArray<Lot> = await this.propertySvc.findAllLots();
        return lots.map(lot => this.entityResultFactory.createLotResult(lot));
      },
      allListings: async ({}): Promise<ReadonlyArray<ListingResult>>  => {
        const listings = await this.listingSvc.findAllListings();
        return listings.map(listing => this.entityResultFactory.createListingResult(listing));
      },
      allPlayers: async ({}): Promise<ReadonlyArray<PlayerResult>> => {
        const players = await this.playerSvc.findAllPlayers();
        return players.map(player => this.entityResultFactory.createPlayerResult(player));
      },
    };

    return graphqlHTTP({
      schema: schema,
      rootValue: root,
      graphiql: true,
    });
  }
}
