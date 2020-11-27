import { v4 } from "uuid";
import Player, { PlayerId } from "../model/Player";

interface FindPlayersCriteria {
  name?: string,
}

export default class Players {
  private readonly playersById: Map<PlayerId, Player> = new Map();

  async createPlayer(name: string): Promise<PlayerId> {
    const id = v4();
    const player: Player = {
      id,
      name,
    };
    this.playersById.set(id, player);
    return id;
  }

  async getPlayers(playerIds: ReadonlyArray<PlayerId>): Promise<ReadonlyMap<PlayerId, Player>> {
    const result: Map<PlayerId, Player> = new Map();
    for (const id of playerIds) {
      if (this.playersById.has(id)) {
        result.set(id, this.playersById.get(id));
      }
    }
    return result;
  }

  async findPlayers(criteria: FindPlayersCriteria): Promise<ReadonlyArray<PlayerId>> {
    let matches = [...this.playersById.values()];

    if (criteria.name) {
      matches = matches.filter(player => player.name.toLowerCase() === criteria.name.toLowerCase());
    }

    return matches.map(player => player.id);
  }
}
