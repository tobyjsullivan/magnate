import {RequestHandler} from 'express';
import { graphqlHTTP } from 'express-graphql';
import GeographyService from '../geography/GeographyService';
import Neighbourhood from '../model/Neighbourhood';
import Property from '../model/Property';
import ListingService from '../property/ListingService';
import PropertyService from '../property/PropertyService';
import ListingResult from './ListingResult';
import NeighbourhoodResult from './NeighbourhoodResult';
import PropertyResult from './PropertyResult';
import { schema } from './Schema';

export function buildHandler(geographySvc: GeographyService, propertySvc: PropertyService, listingSvc: ListingService): RequestHandler {
  const root = {
    allNeighbourhoods: async ({}): Promise<ReadonlyArray<NeighbourhoodResult>> => {
      const allHoods: ReadonlyArray<Neighbourhood> = await geographySvc.findAllNeighbourhoods();
      return allHoods.map(hood => new NeighbourhoodResult(geographySvc, propertySvc, hood));
    },
    allProperties: async ({}): Promise<ReadonlyArray<PropertyResult>> => {
      const allProperties: ReadonlyArray<Property> = await propertySvc.findAllProperties();
      return allProperties.map(property => new PropertyResult(propertySvc, geographySvc, property));
    },
    allListings: async ({}): Promise<ReadonlyArray<ListingResult>>  => {
      const allListings = await listingSvc.findAllListings();
      return allListings.map(listing => new ListingResult(geographySvc, propertySvc, listing));
    },
  };

  return graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  });
}
