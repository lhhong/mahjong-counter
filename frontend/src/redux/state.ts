import { Players } from "../interfaces/players";
import { MJEvent } from "../interfaces/mjEvents";

export interface RootState {
  gameSetup: GameSetup;
  results: Results;
  updates: Updates;
  app: App;
}

export interface GameSetup {
  players: Players<string>;
  config: Config;
}

export interface Config {
  factor: number;
  minTai: number;
  maxTai: number;
  yiPaoSanXiangMaxTai?: number;
  shooter: boolean;
  sanLiu: boolean;
}

export interface Results {
  history: MJEvent[];
}

export interface Updates {
  config: boolean;
  tx: boolean;
  watching?: string;
}

export interface App {
  roomId?: string;
}
