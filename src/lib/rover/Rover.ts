// Importamos los tipos necesarios desde el archivo 'types'
import type { Direction, Obstacle, MoveResult, PlanetSize, RoverPosition } from './types';

export class Rover {
  x: number;
  y: number;
  direction: Direction;
  planetSize: PlanetSize;
  obstacles: Obstacle[];

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

  // Obtener la posición y dirección actual
  getPosition(): RoverPosition {
    return {
      x: this.x,
      y: this.y,
      direction: this.direction
    };
  }

  // Girar a la izquierda
  turnRight(): void {
    switch (this.direction) {
      case 'N': this.direction = 'O'; break;
      case 'O': this.direction = 'S'; break;
      case 'S': this.direction = 'E'; break;
      case 'E': this.direction = 'N'; break;
    }
  }

  // Girar a la derecha
  turnLeft(): void {
    switch (this.direction) {
      case 'N': this.direction = 'E'; break;
      case 'E': this.direction = 'S'; break;
      case 'S': this.direction = 'O'; break;
      case 'O': this.direction = 'N'; break;
    }
  }

  // Detectar obstáculos en una posición
  private hasObstacle(x: number, y: number): boolean {
    return this.obstacles.some(obstacle => obstacle.x === x && obstacle.y === y);
  }

  // Mover hacia adelante
  moveForward(): MoveResult {
    let newX = this.x;
    let newY = this.y;

    // Calcular nueva posición basada en la dirección
    switch (this.direction) {
      case 'N': newY = (newY + 1) % this.planetSize.height; break;
      case 'S': newY = (newY - 1 + this.planetSize.height) % this.planetSize.height; break;
      case 'E': newX = (newX + 1) % this.planetSize.width; break;
      case 'O': newX = (newX - 1 + this.planetSize.width) % this.planetSize.width; break;
    }

    // Verificar si hay obstáculo
    if (this.hasObstacle(newX, newY)) {
      return {
        success: false,
        obstaclePosition: { x: newX, y: newY },
        message: `Obstáculo detectado en (${newX}, ${newY})`
      };
    }

    // Actualizar posición si no hay obstáculo
    this.x = newX;
    this.y = newY;
    return { success: true };
  }

  // Ejecutar una secuencia de comandos
  executeCommands(commands: string): MoveResult {
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i].toUpperCase();
      
      let result: MoveResult = { success: true };
      
      switch (command) {
        case 'F':
          result = this.moveForward();
          break;
        case 'L':
          this.turnLeft();
          break;
        case 'R':
          this.turnRight();
          break;
        default:
          return {
            success: false,
            message: `Comando desconocido: ${command}`
          };
      }

      // Si hubo un obstáculo, detener la ejecución
      if (!result.success) {
        return {
          ...result,
          message: `Secuencia abortada en el comando ${i+1}. ${result.message}`
        };
      }
    }

    return { 
      success: true,
      message: 'Comandos ejecutados'
    };
  }
} 