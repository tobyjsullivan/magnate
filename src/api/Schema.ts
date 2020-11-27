import { buildSchema } from "graphql";

export const schema = buildSchema(`
type Neighbourhood {
  id: String!
  name: String!
  lots: [Lot]!
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

type Lot {
  id: String!
  street: Street!
  lotNumber: Int!
  neighbourhood: Neighbourhood!
}

type Listing {
  id: String!
  lot: Lot!
  askingPrice: Int!
}

type Query {
  allNeighbourhoods: [Neighbourhood]!
  allLots: [Lot]!
  allListings: [Listing]!
}
`);
