import { StreetId } from "./Street";

export type LotId = string;
export type LotNumber = number;

export default interface Lot {
  id: LotId,
  street: StreetId,
  lotNumber: LotNumber,
}
