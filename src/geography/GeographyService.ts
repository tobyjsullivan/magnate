import Block, { BlockId } from "../model/Block";
import Neighbourhood, { NeighbourhoodId } from "../model/Neighbourhood";
import { BuildingNumber } from "../model/Property";
import Street, { StreetId } from "../model/Street";
import Blocks from "./Blocks";
import Neighbourhoods from "./Neighbourhoods";
import Streets from "./Streets";

export default class GeographyService {
  private readonly neighbourhoods: Neighbourhoods;
  private readonly streets: Streets;
  private readonly blocks: Blocks;

  constructor(neighbourhoods: Neighbourhoods, streets: Streets, blocks: Blocks) {
    this.neighbourhoods = neighbourhoods;
    this.streets = streets;
    this.blocks = blocks;
  }

  async createNeighbourhood(name: string): Promise<NeighbourhoodId> {
    // TODO: Check if neighbourhood already exists.

    return await this.neighbourhoods.createNeighbourhood(name);
  }

  async findAllNeighbourhoods(): Promise<ReadonlyArray<Neighbourhood>> {
    const hoodIds = await this.neighbourhoods.findNeighbourhoods();
    const hoods = await this.neighbourhoods.getNeighbourhoods(hoodIds);
    return [...hoods.values()];
  }

  async createStreet(name: string): Promise<StreetId> {
    // TODO: Check if street already exists.
    return await this.streets.createStreet(name);
  }

  async getStreets(streetIds: ReadonlyArray<StreetId>): Promise<Map<StreetId, Street>> {
    return await this.streets.getStreets(streetIds);
  }

  async getStreetBlocks(streetId: StreetId): Promise<ReadonlyArray<Block>> {
    const blockIds = await this.blocks.findBlocks({
      streetFilter: {
        street: streetId,
      },
    });
    const blocks = await this.blocks.getBlocks(blockIds);
    return [...blocks.values()];
  }

  async getNeighbourhoodBlocks(neighbourhoodId: NeighbourhoodId): Promise<ReadonlyArray<Block>> {
    const blockIds = await this.blocks.findBlocks({
      neighbourhoodFilter: {
        neighbourhood: neighbourhoodId,
      },
    });
    const blocks = await this.blocks.getBlocks(blockIds);
    return [...blocks.values()];
  }

  async assignBlockToNeighbourhood(street: StreetId, neighbourhood: NeighbourhoodId, startNumber: BuildingNumber, endNumber: BuildingNumber): Promise<BlockId> {
    // Check if block intersects any existing blocks:
    const conflictingBlocks = await this.blocks.findBlocks({
      streetFilter: {
        street,
        buildingNumbers:{
          start: startNumber,
          end: endNumber
        }
      }
    });
    if (conflictingBlocks.length > 0) {
      throw new Error(`Cannot assign block which conflicts with existing blocks: ${conflictingBlocks}`);
    }

    return await this.blocks.createBlock(street, neighbourhood, startNumber, endNumber);
  }

  async getBlockNeighbourhood(blockId: BlockId): Promise<Neighbourhood> {
    const blocks = await this.blocks.getBlocks([blockId]);
    const block = blocks.get(blockId);
    const neighbourhoods = await this.neighbourhoods.getNeighbourhoods([block.neighbourhood]);
    return neighbourhoods.get(block.neighbourhood);
  }

  async findBlockByAddress(street: StreetId, buildingNumber: BuildingNumber): Promise<Block> {
    const blockIds = await this.blocks.findBlocks({
      streetFilter: {
        street: street,
        buildingNumbers: {
          start: buildingNumber,
          end: buildingNumber,
        },
      },
    });
    const blocks = await this.blocks.getBlocks(blockIds);
    return blocks.get(blockIds[0]);
  }

  async findNeighbourhoodByAddress(street: StreetId, buildingNumber: BuildingNumber): Promise<Neighbourhood> {
    const block = await this.findBlockByAddress(street, buildingNumber);
    const neighbourhoodId = block.neighbourhood;
    const neighbourhoods = await this.neighbourhoods.getNeighbourhoods([neighbourhoodId]);
    return neighbourhoods.get(neighbourhoodId);
  }

  async getBlockStreet(blockId: BlockId): Promise<Street> {
    const blocks = await this.blocks.getBlocks([blockId]);
    const block = blocks.get(blockId);
    const streets = await this.streets.getStreets([block.street]);
    return streets.get(block.street);
  }
}
