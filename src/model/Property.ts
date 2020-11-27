import { StreetId } from "./Street";

export type PropertyId = string;
export type LotNumber = number;

export default interface Property {
  id: PropertyId,
  street: StreetId,
  lotNumber: LotNumber,
  unit?: string,
}
