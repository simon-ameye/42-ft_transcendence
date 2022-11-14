import Player from './player.interface';

export default interface	LiveGameInterface {
	trigger: boolean,
	playerRight: Player,
	playerLeft: Player,
	addPoint: (side: string) => void
}
