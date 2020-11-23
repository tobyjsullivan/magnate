import { NeighbourhoodId } from "./Neighbourhood";
import { BuildingNumber } from "./Property";
import { StreetId } from "./Street";

export type BlockId = string;

export default interface Block {
  id: BlockId,
  street: StreetId,
  neighbourhood: NeighbourhoodId,
  startNumber: BuildingNumber,
  endNumber: BuildingNumber,
}
