import GeographyService from "./geography/GeographyService";
import PropertyService from "./property/PropertyService";

const NEIGHBOURHOOD_NAMES = [
  'Arbutus Ridge',
  'Downtown',
  'Dunbar-Southlands',
  'Fairview',
  'Grandview-Woodland',
  'Hastings-Sunrise',
  'Kensington-Cedar Cottage',
  'Kerrisdale',
  'Killarney',
  'Kitsilano',
  'Marpole',
  'Mount Pleasant',
  'Oakridge',
  'Renfrew-Collingwood',
  'Riley Park',
  'Shaugnessy',
  'South Cambie',
  'Strathcona',
  'Sunset',
  'Victoria-Fraserview',
  'West End',
  'West Point Grey',
];

const STREET_NAMES = [
  'Gilford St',
  'Barclay St',
];

export default class Initializer {
  private readonly geographySvc: GeographyService;
  private readonly propertySvc: PropertyService;

  constructor(geographySvc: GeographyService, propertySvc: PropertyService) {
    this.geographySvc = geographySvc;
    this.propertySvc = propertySvc;
  }

  async init() {
    const neighbourhoodIds = [];
    for (const name of NEIGHBOURHOOD_NAMES) {
      const id = await this.geographySvc.createNeighbourhood(name);
      neighbourhoodIds.push(id);
    }

    const streetIds = [];
    for (const name of STREET_NAMES) {
      const id = await this.geographySvc.createStreet(name);
      streetIds.push(id);
    }

    const blockId = await this.geographySvc.assignBlockToNeighbourhood(streetIds[0], neighbourhoodIds[0], 1, 50);
    await this.propertySvc.createProperty(streetIds[0], 23, '405');
    await this.propertySvc.createProperty(streetIds[0], 23, '306');
    await this.propertySvc.createProperty(streetIds[0], 44);
  }
}
