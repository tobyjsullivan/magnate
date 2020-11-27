import GeographyService from "../geography/GeographyService";
import Neighbourhood, { NeighbourhoodId } from "../model/Neighbourhood";
import Property, { LotNumber, PropertyId } from "../model/Property";
import Street, { StreetId } from "../model/Street";
import Properties from "./Properties";

export default class PropertyService {
  private readonly properties: Properties;
  private readonly geographySvc: GeographyService;

  constructor(properties: Properties, geographySvc: GeographyService) {
    this.properties = properties;
    this.geographySvc = geographySvc;
  }

  async createProperty(street: StreetId, number: LotNumber): Promise<PropertyId> {
    // Check if the property already exists
    const conflictingIds = await this.properties.findProperties({
      streetFilter: {
        street,
        lotNumbers: {
          start: number,
          end: number,
        },
      },
    });
    if (conflictingIds.length > 0) {
      throw new Error(`Cannot create Property when one already exists at that address: ${conflictingIds[0]}`);
    }

    return await this.properties.createProperty(street, number);
  }

  async getProperties(propertyIds: PropertyId[]): Promise<Map<PropertyId, Property>> {
    return await this.properties.getProperties(propertyIds);
  }

  async getPropertyStreet(propertyId: PropertyId): Promise<Street> {
    const properties = await this.properties.getProperties([propertyId]);
    const property = properties.get(propertyId);
    const streetMap = await this.geographySvc.getStreets([property.street]);
    return streetMap.get(property.street);
  }

  async getPropertyNeighbourhood(propertyId: PropertyId): Promise<Neighbourhood> {
    const properties = await this.properties.getProperties([propertyId]);
    const property = properties.get(propertyId);
    return await this.geographySvc.findNeighbourhoodByAddress(property.street, property.lotNumber);
  }

  async findAllProperties(): Promise<ReadonlyArray<Property>> {
    const propertyIds = await this.properties.findProperties({});
    const properties = await this.properties.getProperties(propertyIds);
    return [...properties.values()];
  }

  async findPropertiesByNeighbourhood(neighbourhoodId: NeighbourhoodId): Promise<ReadonlyArray<Property>> {
    const blocks = await this.geographySvc.getNeighbourhoodBlocks(neighbourhoodId);

    const allPropertyIds: PropertyId[] = [];
    for (const block of blocks) {
      const propertyIds = await this.properties.findProperties({
        streetFilter: {
          street: block.street,
          lotNumbers: {
            start: block.startNumber,
            end: block.endNumber,
          },
        },
      });
      propertyIds.forEach(id => allPropertyIds.push(id));
    }
    return [...(await this.properties.getProperties(allPropertyIds)).values()];
  }
}
