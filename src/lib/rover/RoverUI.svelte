<script lang="ts">
  import { onMount } from "svelte";
  import type {
    Direction,
    Obstacle,
    Grid,
    GridCell as GridCellType,
    Position,
    PlanetSize,
  } from "./types";
  import { Rover } from "./Rover";
  import RoverGrid from "./RoverGrid.svelte";
  import { showAlert, showSuccess, showError, showAdvice } from "../utils/alertUtils";

  // Configuración del planeta
  const PLANET_SIZE: PlanetSize = { width: 20, height: 20 };

  // Configuración inicial del rover
  let x = 0;
  let y = 0;
  let direction: Direction = "N";
  let commands = "";
  let result = "";
  let obstacles: Obstacle[] = [];

  // Estado para la visualización
  let grid: Grid = [];
  let rover: Rover;
  // Variable reactiva para forzar la actualización de la UI
  let updateTrigger = 0;

  // Función para obtener una orientación aleatoria
  function getRandomDirection(): Direction {
    const directions: Direction[] = ["N", "E", "S", "O"];
    const randomIndex = Math.floor(Math.random() * directions.length);
    return directions[randomIndex];
  }

  // Función para obtener una posición aleatoria dentro del planeta
  function getRandomPosition(): Position {
    const randomX = Math.floor(Math.random() * PLANET_SIZE.width);
    const randomY = Math.floor(Math.random() * PLANET_SIZE.height);
    return { x: randomX, y: randomY };
  }

  // Inicializar el rover con posición y dirección aleatorias
  function initRover() {
    const initialPosition = getRandomPosition();
    x = initialPosition.x;
    y = initialPosition.y;
    direction = getRandomDirection();

    // Instanciar el rover
    rover = new Rover(x, y, direction, PLANET_SIZE, obstacles);

    // Actualizar la cuadrícula
    updateGrid();
    
    // Incrementar el trigger para forzar la actualización
    updateTrigger++;

    // Mostrar alerta de inicialización
    showAdvice(`Rover inicializado en posición (${x}, ${y}), dirección ${direction}`);
  }

  // Función para actualizar la cuadrícula
  function updateGrid() {
    if (!rover) return;

    const roverPos = rover.getPosition();
    grid = [];

    for (let y = 0; y < PLANET_SIZE.height; y++) {
      const row: GridCellType[] = [];
      for (let x = 0; x < PLANET_SIZE.width; x++) {
        row.push({
          x: x,
          y: y,
          hasRover: x === roverPos.x && y === roverPos.y,
          hasObstacle: obstacles.some((o) => o.x === x && o.y === y),
        });
      }
      grid.push(row);
    }
    
    // Actualizar variables locales para mantener sincronización
    const position = rover.getPosition();
    x = position.x;
    y = position.y;
    direction = position.direction;
  }

  // Cuando se monta el componente, inicializar el rover
  onMount(() => {
    initRover();
  });

  // Función para ejecutar comandos
  function executeCommands() {
    if (!commands) return;

    const moveResult = rover.executeCommands(commands);
    result = moveResult.message || "";

    // Actualizar la cuadrícula
    updateGrid();
    
    // Incrementar el trigger para forzar la actualización
    updateTrigger++;

    // Mostrar alerta según el resultado
    if (moveResult.success) {
      showSuccess(result);
    } else {
      showError(result);
    }

    // Limpiar comandos después de ejecutarlos
    commands = "";
  }

  // Función para validar los comandos de entrada
  function validateCommands(input: string): string {
    // Convertir a mayúsculas
    const upperInput = input.toUpperCase();
    
    // Filtrar solo las letras F, L, R
    return upperInput.split('').filter(char => ['F', 'L', 'R'].includes(char)).join('');
  }

  // Manejador para el evento de cambio en el input
  function handleCommandInput(event: Event) {
    const input = (event.target as HTMLInputElement).value;
    commands = validateCommands(input);
  }

  // Función para agregar un obstáculo
  function addObstacle() {
    // Generar una posición aleatoria que no sea donde está el rover
    const roverPos = rover.getPosition();
    let obsX, obsY;

    do {
      obsX = Math.floor(Math.random() * PLANET_SIZE.width);
      obsY = Math.floor(Math.random() * PLANET_SIZE.height);
    } while (obsX === roverPos.x && obsY === roverPos.y);

    obstacles = [...obstacles, { x: obsX, y: obsY }];

    // Recrear el rover con los nuevos obstáculos
    rover = new Rover(
      roverPos.x,
      roverPos.y,
      roverPos.direction,
      PLANET_SIZE,
      obstacles
    );

    // Actualizar la cuadrícula
    updateGrid();
    
    // Incrementar el trigger para forzar la actualización
    updateTrigger++;

    // Mostrar alerta
    showAdvice(`Obstáculo añadido en posición (${obsX}, ${obsY})`);
  }

  // Función para limpiar obstáculos
  function clearObstacles() {
    obstacles = [];
    const roverPos = rover.getPosition();
    rover = new Rover(
      roverPos.x,
      roverPos.y,
      roverPos.direction,
      PLANET_SIZE,
      []
    );
    updateGrid();
    
    // Incrementar el trigger para forzar la actualización
    updateTrigger++;

    // Mostrar alerta
    showAdvice("Todos los obstáculos han sido eliminados");
  }

  // Función para reiniciar el rover
  function resetRover() {
    initRover();
    result = "";

    // Mostrar alerta
    showAdvice("Rover reiniciado con nueva posición y dirección");
  }

  // Ejemplo de cómo usar la función showAlert directamente
  function testAlerts() {
    showAlert('success', 'Ejemplo de alerta de éxito');
    setTimeout(() => {
      showAlert('error', 'Ejemplo de alerta de error', 7000);
    }, 1000);
    setTimeout(() => {
      showAlert('advice', 'Ejemplo de alerta de consejo', 9000);
    }, 2000);
  }
</script>
<h1 class="text-3xl font-bold text-center text-white">Mars Rover Mission</h1>
<div class="flex flex-row p-6 w-full items-start justify-center gap-x-4">


  <div class="flex flex-col max-w-2xl basis-0">
    <!-- Panel de información -->
    <div class="panel">
      <h2 class="panel-title">Información del Rover</h2>
      {#if rover && updateTrigger >= 0}
        <div class="flex items-center mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="icon"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
            />
          </svg>
          <p>Posición: ({rover.getPosition().x}, {rover.getPosition().y})</p>
        </div>
        <div class="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="icon"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
            />
          </svg>
          <p>Dirección: {rover.getPosition().direction}</p>
        </div>
      {/if}
    </div>
    <!-- Panel de comandos -->
    <div class="panel">
      <h2 class="panel-title">Comandos</h2>
      <p class="mb-2 text-sm">
        F: Avanzar, L: Girar izquierda, R: Girar derecha
      </p>
      <div class="flex space-x-2">
        <input
          type="text"
          value={commands}
          on:input={handleCommandInput}
          placeholder="Ej: FFRLF"
          class="flex-1 p-2 border rounded uppercase"
          maxlength="20"
        />
        <button
          on:click={executeCommands}
          class="btn btn-green"
          aria-label="Ejecutar comandos"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="icon mr-1"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
            />
          </svg>
        </button>
      </div>

      {#if result}
        <div class="mt-4 p-2 bg-gray-100 dark:bg-gray-700 rounded">
          <p class="flex items-center">
            {#if result.includes("exito")}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="icon text-green-500"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            {:else}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="icon text-yellow-500"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            {/if}
            {result}
          </p>
        </div>
      {/if}
    </div>

    <!-- Panel de acciones -->
    <div class="panel">
      <h2 class="panel-title">Obstaculos</h2>
      <div class="flex flex-col space-y-2">
        <button on:click={addObstacle} class="btn btn-green">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="icon mr-1"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Agregar
        </button>

        <button on:click={clearObstacles} class="btn btn-red">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="icon mr-1"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>
          Eliminar
        </button>
      </div>
    </div>
    <div class="panel w-full">
      <h2 class="panel-title">Instrucciones</h2>
      <ul class="list-disc pl-5 space-y-1">
        <li>El rover se mueve en un planeta cuadrado de 20x20.</li>
        <li>Ingresa comandos para controlar el rover.</li>
        <li>
          <span class="command-key">F</span>: Mover hacia adelante en la
          dirección actual.
        </li>
        <li><span class="command-key">L</span>: Girar 90° a la izquierda.</li>
        <li><span class="command-key">R</span>: Girar 90° a la derecha.</li>
        <li>
          Si el rover encuentra un obstáculo, se detendrá antes de chocar.
        </li>
      </ul>
    </div>
  </div>
  <div class="flex flex-col space-y-4 w-full max-w-4xl">
    <!-- Cuadrícula del planeta -->
    {#if rover}
      <RoverGrid
        {grid}
        roverDirection={rover.getPosition().direction}
      />
    {/if}
  </div>
</div>

<style>
  .panel {
    background-color: var(--panel-bg, white);
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    color: #6c7e89;
    margin-bottom: 16px;
  }

  .panel-title {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    color: #000;
  }

  /* Estilos para los iconos SVG */
  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    margin-right: 8px;
  }

  /* Estilos para las teclas de comando */
  .command-key {
    background-color: #f1f5f9;
    border: 1px solid #cbd5e1;
    border-radius: 4px;
    padding: 2px 6px;
    margin: 0 2px;
    font-family: monospace;
    font-weight: bold;
  }

  /* Estilos de botones consistentes */
  .btn {
    padding: 8px 16px;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .btn-green {
    background-color: var(--green-color, hsl(120, 100%, 35%));
    color: white;
  }

  .btn-red {
    background-color: var(--red-color, #dc2626);
    color: white;
  }
</style>
