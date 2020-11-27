import Player from "../model/Player";

export default class PlayerResult {
  readonly id: string;
  readonly name: string;

  constructor(player: Player) {
    this.id = player.id;
    this.name = player.name;
  }
}
