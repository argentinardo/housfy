// Importamos los tipos necesarios desde el archivo 'types'
import type {
  Direction,
  Obstacle,
  MoveResult,
  PlanetSize,
  RoverPosition,
} from "./types";

/**
 * Clase que representa el Mars Rover.
 * Maneja la posición, dirección y movimiento del rover en un planeta de tamaño definido.
 * Incluye detección de obstáculos y límites del planeta.
 */
export class Rover {
  /** Posición X actual del rover en el planeta */
  x: number;
  
  /** Posición Y actual del rover en el planeta */
  y: number;
  
  /** Dirección actual del rover (N, S, E, O) */
  direction: Direction;
  
  /** Tamaño del planeta donde se mueve el rover */
  planetSize: PlanetSize;
  
  /** Lista de obstáculos presentes en el planeta */
  obstacles: Obstacle[];

  /**
   * Crea una nueva instancia del Rover
   * @param x - Coordenada X inicial del rover
   * @param y - Coordenada Y inicial del rover
   * @param direction - Dirección inicial del rover (N, S, E, O)
   * @param planetSize - Tamaño del planeta (por defecto 20x20)
   * @param obstacles - Lista de obstáculos en el planeta (por defecto vacía)
   */
  constructor(
    x: number,
    y: number,
    direction: Direction,
    planetSize: PlanetSize = { width: 20, height: 20 },
    obstacles: Obstacle[] = []
  ) {
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.planetSize = planetSize;
    this.obstacles = obstacles;
  }

  /**
   * Obtener la posición y dirección actual del rover
   * @returns Objeto con coordenadas x, y y dirección del rover
   */
  getPosition(): RoverPosition {
    return {
      x: this.x,
      y: this.y,
      direction: this.direction,
    };
  }

  /**
   * Gira el rover 90 grados a la derecha
   * Cambia la dirección en sentido horario: N -> E -> S -> O -> N
   */
  turnRight(): void {
    switch (this.direction) {
      case "N":
        this.direction = "E";
        break;
      case "O":
        this.direction = "N";
        break;
      case "S":
        this.direction = "O";
        break;
      case "E":
        this.direction = "S";
        break;
    }
  }

  /**
   * Gira el rover 90 grados a la izquierda
   * Cambia la dirección en sentido antihorario: N -> O -> S -> E -> N
   */
  turnLeft(): void {
    switch (this.direction) {
      case "N":
        this.direction = "O";
        break;
      case "E":
        this.direction = "N";
        break;
      case "S":
        this.direction = "E";
        break;
      case "O":
        this.direction = "S";
        break;
    }
  }

  /**
   * Verifica si hay un obstáculo en las coordenadas especificadas
   * @param x - Coordenada X a verificar
   * @param y - Coordenada Y a verificar
   * @returns true si hay un obstáculo en esas coordenadas, false en caso contrario
   * @private Método privado utilizado internamente
   */
  private hasObstacle(x: number, y: number): boolean {
    return this.obstacles.some(
      (obstacle) => obstacle.x === x && obstacle.y === y
    );
  }

  /**
   * Mueve el rover un paso hacia adelante en la dirección actual
   * Detecta límites del planeta y obstáculos
   * @returns Resultado del movimiento con mensaje de éxito o error
   */
  moveForward(): MoveResult {
    let newX = this.x;
    let newY = this.y;

    // Calcular nueva posición basada en la dirección
    switch (this.direction) {
      case "N": // Norte (hacia arriba, disminuye Y)
        newY = newY - 1;
        break;
      case "S": // Sur (hacia abajo, aumenta Y)
        newY = newY + 1;
        break;
      case "E": // Este (hacia la derecha, aumenta X)
        newX = newX + 1;
        break;
      case "O": // Oeste (hacia la izquierda, disminuye X)
        newX = newX - 1;
        break;
    }

    // Verificar si la nueva posición está fuera de la grilla
    if (newX < 0 || newX >= this.planetSize.width || newY < 0 || newY >= this.planetSize.height) {
      return {
        success: false,
        message: `Has alcanzado el límite de la grilla en dirección ${this.direction}`,
      };
    }

    // Verificar si hay obstáculo
    if (this.hasObstacle(newX, newY)) {
      return {
        success: false,
        obstaclePosition: { x: newX, y: newY },
        message: `Obstáculo detectado en (${newX}, ${newY})`,
      };
    }

    // Actualizar posición si no hay obstáculo ni está fuera de la grilla
    this.x = newX;
    this.y = newY;
    return { 
      success: true,
      message: `Rover se movió a la posición (${this.x}, ${this.y})` 
    };
  }

  /**
   * Ejecuta una secuencia de comandos en el rover
   * Procesa cada comando en orden hasta que todos sean ejecutados o hasta encontrar un obstáculo/límite
   * @param commands - Cadena de comandos a ejecutar (F: avanzar, L: girar izquierda, R: girar derecha)
   * @returns Resultado de la ejecución con mensaje de éxito o error
   */
  executeCommands(commands: string): MoveResult {
    let executedCommands = 0;
    
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i].toUpperCase();

      let result: MoveResult = { success: true };

      // Procesar cada tipo de comando
      switch (command) {
        case "F": // Mover hacia adelante
          result = this.moveForward();
          break;
        case "L": // Girar a la izquierda
          this.turnLeft();
          result = { 
            success: true, 
            message: `Rover giró a la izquierda, ahora mira hacia ${this.direction}` 
          };
          break;
        case "R": // Girar a la derecha
          this.turnRight();
          result = { 
            success: true, 
            message: `Rover giró a la derecha, ahora mira hacia ${this.direction}` 
          };
          break;
        default: // Comando desconocido
          return {
            success: false,
            message: `Comando desconocido: ${command}`,
          };
      }

      executedCommands++;

      // Si hubo un obstáculo o se alcanzó el límite, detener la ejecución
      if (!result.success) {
        return {
          ...result,
          message: `Secuencia abortada en el comando ${i + 1}. ${result.message}`,
        };
      }
    }

    // Todos los comandos se ejecutaron con éxito
    return {
      success: true,
      message: `Comandos ejecutados con éxito. Posición final: (${this.x}, ${this.y}), dirección: ${this.direction}`,
    };
  }
}
