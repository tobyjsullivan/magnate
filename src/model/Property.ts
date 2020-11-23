import { StreetId } from "./Street";

export type PropertyId = string;
export type BuildingNumber = number;

export default interface Property {
  id: PropertyId,
  street: StreetId,
  buildingNumber: BuildingNumber,
  unit?: string,
}
