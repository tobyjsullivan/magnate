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
  startLotNumber: Int!
  endLotNumber: Int!
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
  lotNumber: Int!
  unit: String
  neighbourhood: Neighbourhood!
}

type Listing {
  id: String!
  property: Property!
  askingPrice: Int!
}

type Query {
  allNeighbourhoods: [Neighbourhood]!
  allProperties: [Property]!
  allListings: [Listing]!
}
`);
