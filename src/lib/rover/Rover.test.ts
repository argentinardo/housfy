import { describe, it, expect } from "vitest";
import { Rover } from "./Rover";
import type { Obstacle } from "./types";

describe("Rover", () => {
  // Prueba de movimiento básico
  it("debe avanzar correctamente hacia el norte", () => {
    const rover = new Rover(0, 0, "N");
    rover.moveForward();
    const position = rover.getPosition();
    expect(position.x).toBe(0);
    expect(position.y).toBe(1);
    expect(position.direction).toBe("N");
  });

  // Prueba de giro a la izquierda
  it("debe girar a la izquierda correctamente", () => {
    const rover = new Rover(0, 0, "N");
    rover.turnLeft();
    expect(rover.getPosition().direction).toBe("O");
    rover.turnLeft();
    expect(rover.getPosition().direction).toBe("S");
    rover.turnLeft();
    expect(rover.getPosition().direction).toBe("E");
    rover.turnLeft();
    expect(rover.getPosition().direction).toBe("N");
  });

  // Prueba de giro a la derecha
  it("debe girar a la derecha correctamente", () => {
    const rover = new Rover(0, 0, "N");
    rover.turnRight();
    expect(rover.getPosition().direction).toBe("E");
    rover.turnRight();
    expect(rover.getPosition().direction).toBe("S");
    rover.turnRight();
    expect(rover.getPosition().direction).toBe("O");
    rover.turnRight();
    expect(rover.getPosition().direction).toBe("N");
  });

  // Prueba de ejecución de comandos
  it("debe ejecutar secuencias de comandos correctamente", () => {
    const rover = new Rover(0, 0, "N");
    rover.executeCommands("FFRFF");
    const position = rover.getPosition();
    expect(position.x).toBe(2);
    expect(position.y).toBe(2);
    expect(position.direction).toBe("E");
  });

  // Prueba de detección de obstáculos
  it("debe detectar obstáculos y detenerse", () => {
    const obstacles: Obstacle[] = [{ x: 0, y: 2 }];
    const rover = new Rover(0, 0, "N", { width: 200, height: 200 }, obstacles);

    // Avanzar una vez está bien (no hay obstáculo)
    let result = rover.moveForward();
    expect(result.success).toBe(true);

    // Avanzar de nuevo encontrará un obstáculo
    result = rover.moveForward();
    expect(result.success).toBe(false);
    expect(result.obstaclePosition).toEqual({ x: 0, y: 2 });

    // La posición debe ser (0, 1) porque se detuvo antes del obstáculo
    const position = rover.getPosition();
    expect(position.x).toBe(0);
    expect(position.y).toBe(1);
  });

  // Prueba de bordes del planeta (envolvente)
  it("debe envolver los bordes del planeta correctamente", () => {
    // Caso 1: Borde Este
    let rover = new Rover(19, 19, "E", { width: 20, height: 20 });
    rover.moveForward();
    let position = rover.getPosition();
    expect(position.x).toBe(0);
    expect(position.y).toBe(19);

    // Caso 2: Borde Oeste
    rover = new Rover(0, 0, "O", { width: 20, height: 20 });
    rover.moveForward();
    position = rover.getPosition();
    expect(position.x).toBe(19);
    expect(position.y).toBe(0);

    // Caso 3: Borde Sur
    rover = new Rover(0, 0, "S", { width: 20, height: 20 });
    rover.moveForward();
    position = rover.getPosition();
    expect(position.x).toBe(0);
    expect(position.y).toBe(19);
  });

  // Prueba de comandos desconocidos
  it("debe manejar comandos desconocidos", () => {
    const rover = new Rover(0, 0, "N");
    const result = rover.executeCommands("FXF");
    expect(result.success).toBe(false);
    expect(result.message).toContain("Comando desconocido");

    // Debe haber ejecutado el primer comando F antes de encontrar el error
    const position = rover.getPosition();
    expect(position.y).toBe(1);
  });

  // Prueba de secuencia con obstáculos
  it("debe abortar la secuencia cuando encuentra un obstáculo", () => {
    const obstacles: Obstacle[] = [{ x: 0, y: 3 }];
    const rover = new Rover(0, 0, "N", { width: 200, height: 200 }, obstacles);

    const result = rover.executeCommands("FFFFF");
    expect(result.success).toBe(false);
    expect(result.message).toContain("Secuencia abortada");

    // Debe haberse detenido antes del obstáculo
    const position = rover.getPosition();
    expect(position.y).toBe(2);
  });
});
