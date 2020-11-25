import { PersonId } from "../model/Person";
import { PropertyId } from "../model/Property";

export default class LandTitleRegistry {
  private readonly ownersByPropertyId: Map<PropertyId, PersonId> = new Map();

  async searchOwner(property: PropertyId): Promise<PersonId | undefined> {
    if (!this.ownersByPropertyId.has(property)) {
      return undefined;
    }
    return this.ownersByPropertyId.get(property);
  }

  async transferOwnership(property: PropertyId, currentOwner: PersonId | undefined, newOwner: PersonId) {
    if (currentOwner === undefined) {
      if (this.ownersByPropertyId.has(property)) {
        throw new Error(`Attempted to transfer owned property without specifying current owner. ${property}`);
      }

      this.ownersByPropertyId.set(property, newOwner);
    } else {
      if (this.ownersByPropertyId.get(property) !== currentOwner) {
        throw new Error(`Attemted to transfer owned property but specified wrong owner. ${property}`);
      }

      this.ownersByPropertyId.set(property, newOwner);
    }
  }
}
