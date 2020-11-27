import { LotId } from "./Lot";

export type ListingId = string;

export default interface Listing {
  id: ListingId,
  lot: LotId,
  askingPrice: number,
}
