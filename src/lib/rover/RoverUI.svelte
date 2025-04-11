<script lang="ts">
  import { onMount } from "svelte";
  import type {
    Direction,
    Obstacle,
    Grid,
    GridCell as GridCellType,
  } from "./types";
  import { Rover } from "./Rover";
  import RoverGrid from "./RoverGrid.svelte";
  import {
    showSuccessAlert as showSuccess,
    showErrorAlert as showError,
    showAdviceAlert as showAdvice,
    showInfoAlert as showInfo,
  } from "../utils/simpleAlertUtils";

  import RoverInfo from "../components/RoverInfo.svelte";
  import CommandInput from "../components/CommandInput.svelte";
  import ObstacleControls from "../components/ObstacleControls.svelte";
  import InstructionsPanel from "../components/InstructionsPanel.svelte";

  const PLANET_WIDTH = 20;
  const PLANET_HEIGHT = 20;
  // Límite máximo de obstáculos (todas las celdas menos la que ocupa el rover)
  const MAX_OBSTACLES = PLANET_WIDTH * PLANET_HEIGHT - 1;

  let x = 0;
  let y = 0;

  let direction: Direction = "N";
  let commands = "";
  let result = "";
  let obstacles: Obstacle[] = [];

  let grid: Grid = [];
  let rover: Rover;
  let updateTrigger = 0;

  // Función para mostrar alerta cuando se intenta una acción deshabilitada
  function showDisabledActionAlert(action: string) {
    showInfo(`Acción no disponible: ${action}`);
  }

  function getRandomDirection(): Direction {
    const directions: Direction[] = ["N", "E", "S", "O"];
    return directions[Math.floor(Math.random() * 4)];
  }

  function initRover() {
    x = Math.floor(Math.random() * PLANET_WIDTH);
    y = Math.floor(Math.random() * PLANET_HEIGHT);
    direction = getRandomDirection();

    rover = new Rover(
      x,
      y,
      direction,
      { width: PLANET_WIDTH, height: PLANET_HEIGHT },
      obstacles
    );

    updateGrid();
    updateTrigger++;
    showAdvice(
      `Rover inicializado en posición (${x}, ${y}), dirección ${direction}`
    );
  }

  function updateGrid() {
    if (!rover) return;

    const roverPos = rover.getPosition();
    grid = [];

    for (let y = 0; y < PLANET_HEIGHT; y++) {
      const row: GridCellType[] = [];
      for (let x = 0; x < PLANET_WIDTH; x++) {
        row.push({
          x: x,
          y: y,
          hasRover: x === roverPos.x && y === roverPos.y,
          hasObstacle: obstacles.some((o) => o.x === x && o.y === y),
        });
      }
      grid.push(row);
    }

    const position = rover.getPosition();
    x = position.x;
    y = position.y;
    direction = position.direction;
  }

  onMount(() => {
    initRover();
  });

  function executeCommands() {
    if (!commands) {
      showDisabledActionAlert("No hay comandos para ejecutar");
      return;
    }

    const moveResult = rover.executeCommands(commands);
    result = moveResult.message || "";

    updateGrid();

    updateTrigger++;

    if (moveResult.success) {
      showSuccess(result);
    } else {
      showError(result);
    }

    commands = "";
    const roverPos = rover.getPosition();
    rover = new Rover(
      roverPos.x,
      roverPos.y,
      roverPos.direction,
      { width: PLANET_WIDTH, height: PLANET_HEIGHT },
      obstacles
    );
  }

  function addObstacle() {
    if (obstacles.length >= MAX_OBSTACLES) {
      showDisabledActionAlert(
        "El planeta está lleno. Ya no caben más obstáculos"
      );
      return;
    }

    const roverPos = rover.getPosition();
    let obsX: number = 0;
    let obsY: number = 0;
    let isCellOccupied = true;
    let attempts = 0;
    const maxAttempts = 100; // Evitar bucles infinitos

    while (isCellOccupied && attempts < maxAttempts) {
      obsX = Math.floor(Math.random() * PLANET_WIDTH);
      obsY = Math.floor(Math.random() * PLANET_HEIGHT);

      isCellOccupied =
        (obsX === roverPos.x && obsY === roverPos.y) ||
        obstacles.some((obs) => obs.x === obsX && obs.y === obsY);

      attempts++;
    }

    if (attempts >= maxAttempts) {
      showError(
        "No se pudo añadir un obstáculo después de varios intentos. Puede que el planeta esté muy ocupado."
      );
      return;
    }

    obstacles = [...obstacles, { x: obsX, y: obsY }];

    rover = new Rover(
      roverPos.x,
      roverPos.y,
      roverPos.direction,
      { width: PLANET_WIDTH, height: PLANET_HEIGHT },
      obstacles
    );

    updateGrid();
    updateTrigger++;
    showAdvice(
      `Obstáculo añadido en posición (${obsX}, ${obsY}).`
    );
  }

  function clearObstacles() {
    if (obstacles.length === 0) {
      showDisabledActionAlert("No hay obstáculos para eliminar");
      return;
    }

    obstacles = [];
    const roverPos = rover.getPosition();

    rover = new Rover(
      roverPos.x,
      roverPos.y,
      roverPos.direction,
      { width: PLANET_WIDTH, height: PLANET_HEIGHT },
      []
    );

    updateGrid();
    updateTrigger++;
    showAdvice("Todos los obstáculos han sido eliminados");
  }

  // Funciones para manejar clics en botones deshabilitados
  function handleAddObstacleClick() {
    if (obstacles.length >= MAX_OBSTACLES) {
      showDisabledActionAlert(
        "El planeta está lleno. Ya no caben más obstáculos"
      );
    } else {
      addObstacle();
    }
  }

  function handleClearObstaclesClick() {
    if (obstacles.length === 0) {
      showDisabledActionAlert("No hay obstáculos para eliminar");
    } else {
      clearObstacles();
    }
  }

  function handleExecuteCommandsClick() {
    if (!commands) {
      showDisabledActionAlert("No hay comandos para ejecutar");
    } else {
      executeCommands();
    }
  }
</script>

<h1 class="text-3xl font-bold text-center text-white mb-8">
  Mars Rover Mission
</h1>

<div class="flex flex-col md:flex-row w-full items-start justify-center gap-4">
  <div
    class="flex flex-col sticky-column md:max-w-xs lg:max-w-sm xl:max-w-md gap-4"
  >
    <RoverInfo {rover} {updateTrigger} />

    <CommandInput
      bind:commands
      onExecuteCommands={handleExecuteCommandsClick}
    />

    <ObstacleControls
      onAddObstacle={handleAddObstacleClick}
      onClearObstacles={handleClearObstaclesClick}
      obstaclesCount={obstacles.length}
      maxObstacles={MAX_OBSTACLES}
    />
  </div>
  <div class="flex flex-col w-full">
    {#if rover}
      <RoverGrid {grid} roverDirection={rover.getPosition().direction} />
    {/if}
  </div>
</div>

<InstructionsPanel />

<style>
  :global(.sticky-column) {
    position: sticky;
    top: 16px;
    align-self: flex-start;
    width: 100%;
  }

  @media (max-width: 768px) {
    :global(.sticky-column) {
      position: static;
      max-height: none;
    }
  }
</style>
