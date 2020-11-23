import { buildSchema } from "graphql";

export const schema = buildSchema(`
type Neighbourhood {
  id: String!
  name: String!
  properties: [Property]!
}

type Block {
  id: String!
  street: Street!
  startNumber: Int!
  endNumber: Int!
  neighbourhood: Neighbourhood!
}

type Street {
  id: String!
  name: String!
  blocks: [Block]!
}

type Property {
  id: String!
  street: Street!
  buildingNumber: Int!
  unit: String
  neighbourhood: Neighbourhood!
}

type Query {
  allNeighbourhoods: [Neighbourhood]!
  allProperties: [Property]!
}
`);
