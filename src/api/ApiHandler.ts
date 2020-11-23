import {RequestHandler} from 'express';
import { graphqlHTTP } from 'express-graphql';
import GeographyService from '../geography/GeographyService';
import Neighbourhood from '../model/Neighbourhood';
import Property from '../model/Property';
import PropertyService from '../property/PropertyService';
import NeighbourhoodResult from './NeighbourhoodResult';
import PropertyResult from './PropertyResult';
import { schema } from './Schema';

export function buildHandler(geographySvc: GeographyService, propertySvc: PropertyService): RequestHandler {
  const root = {
    allNeighbourhoods: async ({}): Promise<ReadonlyArray<NeighbourhoodResult>> => {
      const allHoods: ReadonlyArray<Neighbourhood> = await geographySvc.getAllNeighbourhoods();
      return allHoods.map(hood => new NeighbourhoodResult(geographySvc, propertySvc, hood));
    },
    allProperties: async ({}): Promise<ReadonlyArray<PropertyResult>> => {
      const allProperties: ReadonlyArray<Property> = await propertySvc.findAllProperties();
      return allProperties.map(property => new PropertyResult(propertySvc, geographySvc, property));
    },
  };

  return graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  });
}
