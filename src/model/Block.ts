import { NeighbourhoodId } from "./Neighbourhood";
import { LotNumber } from "./Lot";
import { StreetId } from "./Street";

export type BlockId = string;

export default interface Block {
  id: BlockId,
  street: StreetId,
  neighbourhood: NeighbourhoodId,
  startNumber: LotNumber,
  endNumber: LotNumber,
}
