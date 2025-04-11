export type Direction = "N" | "S" | "E" | "O";

export interface Obstacle {
  x: number;
  y: number;
}

export interface MoveResult {
  success: boolean;
  message?: string;
  obstaclePosition?: Obstacle;
}

export interface Position {
  x: number;
  y: number;
}

export interface RoverPosition {
  x: number;
  y: number;
  direction: Direction;
}

export interface PlanetSize {
  width: number;
  height: number;
}

export interface GridCell {
  x: number;
  y: number;
  hasRover: boolean;
  hasObstacle: boolean;
}

export type Grid = GridCell[][];

export interface RoverEvents {
  initialized: { position: Position; direction: Direction };
  commandExecuted: {
    success: boolean;
    newPosition: RoverPosition;
    message: string;
  };
  obstacleAdded: { obstacles: Obstacle[] };
  obstaclesCleared: void;
  roverReset: void;
}
