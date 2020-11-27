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

export function buildHandler(geographySvc: GeographyService, propertySvc: PropertyService, listingSvc: ListingService): RequestHandler {
  const root = {
    allNeighbourhoods: async ({}): Promise<ReadonlyArray<NeighbourhoodResult>> => {
      const hoods: ReadonlyArray<Neighbourhood> = await geographySvc.findAllNeighbourhoods();
      return hoods.map(hood => new NeighbourhoodResult(geographySvc, propertySvc, hood));
    },
    allLots: async ({}): Promise<ReadonlyArray<LotResult>> => {
      const lots: ReadonlyArray<Lot> = await propertySvc.findAllLots();
      return lots.map(lot => new LotResult(propertySvc, geographySvc, lot));
    },
    allListings: async ({}): Promise<ReadonlyArray<ListingResult>>  => {
      const listings = await listingSvc.findAllListings();
      return listings.map(listing => new ListingResult(geographySvc, propertySvc, listing));
    },
  };

  return graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  });
}
