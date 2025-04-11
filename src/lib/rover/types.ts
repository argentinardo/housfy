/** 
 * Los tipos de dirección que puede tener el rover.
 * N: Norte, S: Sur, E: Este, O: Oeste
 */
export type Direction = "N" | "S" | "E" | "O";

/** 
 * Representa un obstáculo en el planeta.
 * Contiene sus coordenadas x, y.
 */
export interface Obstacle {
  /** Coordenada X del obstáculo */
  x: number;
  /** Coordenada Y del obstáculo */
  y: number;
}

/**
 * Resultado de una operación de movimiento o de ejecución de comandos.
 * Indica si fue exitoso y proporciona un mensaje descriptivo.
 */
export interface MoveResult {
  /** Indica si la operación fue exitosa */
  success: boolean;
  /** Mensaje descriptivo del resultado de la operación */
  message?: string;
  /** Posición del obstáculo en caso de colisión */
  obstaclePosition?: Obstacle;
}

export interface Position {
  x: number;
  y: number;
}

/**
 * Representa la posición actual del rover.
 * Incluye coordenadas x, y y la dirección hacia la que mira.
 */
export interface RoverPosition {
  /** Coordenada X del rover */
  x: number;
  /** Coordenada Y del rover */
  y: number;
  /** Dirección hacia la que mira el rover */
  direction: Direction;
}

/**
 * Representa las dimensiones del planeta.
 */
export interface PlanetSize {
  /** Ancho del planeta (número de columnas) */
  width: number;
  /** Alto del planeta (número de filas) */
  height: number;
}

/**
 * Representa una celda en la cuadrícula del planeta.
 */
export interface GridCell {
  /** Coordenada X de la celda */
  x: number;
  /** Coordenada Y de la celda */
  y: number;
  /** Indica si el rover está en esta celda */
  hasRover: boolean;
  /** Indica si hay un obstáculo en esta celda */
  hasObstacle: boolean;
}

/**
 * Representa la cuadrícula completa del planeta.
 * Es una matriz bidimensional de celdas.
 */
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
