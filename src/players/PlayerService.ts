import Player, { PlayerId } from "../model/Player";
import Players from "./Players";

export default class PlayerService {
  private readonly players: Players;

  constructor(players: Players) {
    this.players = players;
  }

  async createPlayer(username: string): Promise<PlayerId> {
    // Find any existing players with the same name
    const conflictingIds = await this.players.findPlayers({name: username});
    if (conflictingIds.length > 0) {
      throw new Error(`Player already exists with that username: ${username}`);
    }

    return await this.players.createPlayer(username);
  }

  async getPlayers(playerIds: ReadonlyArray<PlayerId>): Promise<ReadonlyMap<PlayerId, Player>> {
    return await this.players.getPlayers(playerIds);
  }

  async findAllPlayers(): Promise<ReadonlyArray<Player>> {
    const playerIds = await this.players.findPlayers({});
    const players = await this.players.getPlayers(playerIds);
    return [...players.values()];
  }
}
