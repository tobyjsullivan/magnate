import { PropertyId } from "./Property";

export type ListingId = string;

export default interface Listing {
  id: ListingId,
  property: PropertyId,
  askingPrice: number,
}
