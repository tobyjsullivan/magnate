import { PlayerId } from "../model/Player";
import { LotId } from "../model/Lot";

export default class LandTitleRegistry {
  private readonly ownersByLotId: Map<LotId, PlayerId> = new Map();

  async searchOwner(lot: LotId): Promise<PlayerId | undefined> {
    if (!this.ownersByLotId.has(lot)) {
      return undefined;
    }
    return this.ownersByLotId.get(lot);
  }

  async transferOwnership(lot: LotId, currentOwner: PlayerId | undefined, newOwner: PlayerId) {
    if (currentOwner === undefined) {
      if (this.ownersByLotId.has(lot)) {
        throw new Error(`Attempted to transfer owned property without specifying current owner. ${lot}`);
      }

      this.ownersByLotId.set(lot, newOwner);
    } else {
      if (this.ownersByLotId.get(lot) !== currentOwner) {
        throw new Error(`Attemted to transfer owned property but specified wrong owner. ${lot}`);
      }

      this.ownersByLotId.set(lot, newOwner);
    }
  }
}
