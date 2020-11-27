import GeographyService from "../geography/GeographyService";
import Neighbourhood, { NeighbourhoodId } from "../model/Neighbourhood";
import Property, { BuildingNumber, PropertyId } from "../model/Property";
import Street, { StreetId } from "../model/Street";
import Properties from "./Properties";

export default class PropertyService {
  private readonly properties: Properties;
  private readonly geographySvc: GeographyService;

  constructor(properties: Properties, geographySvc: GeographyService) {
    this.properties = properties;
    this.geographySvc = geographySvc;
  }

  async createProperty(street: StreetId, number: BuildingNumber, unit?: string): Promise<PropertyId> {
    // Check if the property already exists
    const conflictingIds = await this.properties.findProperties({
      streetFilter: {
        street,
        buildingNumbers: {
          start: number,
          end: number,
        },
      },
    });
    // Check the specific units
    const conflictingProps = await this.properties.getProperties(conflictingIds);
    for (const prop of conflictingProps.values()) {
      if (prop.unit === undefined || prop.unit === unit) {
        throw new Error(`Cannot create Property when one already exists at that address: ${prop.id}`);
      }
    }

    return await this.properties.createProperty(street, number, unit);
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
    return await this.geographySvc.findNeighbourhoodByAddress(property.street, property.buildingNumber);
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
          buildingNumbers: {
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
