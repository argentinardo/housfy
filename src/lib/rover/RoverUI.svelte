<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import type { Direction, Obstacle, Grid, GridCell as GridCellType, Position, PlanetSize, RoverEvents } from './types';
  import { Rover } from './Rover';
  import RoverGrid from './RoverGrid.svelte';
  
  // Configuración del planeta
  const GRID_SIZE = 20; // Tamaño total del planeta
  const PLANET_SIZE: PlanetSize = { width: 20, height: 20 };
  
  // Configuración inicial del rover
  let x = 0;
  let y = 0;
  let direction: Direction = 'N';
  let commands = '';
  let result = '';
  let obstacles: Obstacle[] = [];

  // Estado para la visualización
  let grid: Grid = [];
  let rover: Rover;
  
  // Event dispatcher para comunicar eventos a componentes padres (siguiendo patrones de webcomponents)
  const dispatch = createEventDispatcher<RoverEvents>();
  
  // Función para obtener una orientación aleatoria
  function getRandomDirection(): Direction {
    const directions: Direction[] = ['N', 'E', 'S', 'O'];
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
    
    // Comunicar el estado inicial (patrón de webcomponents)
    dispatch('initialized', { position: { x, y }, direction });
  }
  
  // Función para actualizar la cuadrícula
  function updateGrid() {
    if (!rover) return;
    
    const roverPos = rover.getPosition();
    grid = [];
    
    // Crear la cuadrícula completa del planeta (20x20)
    for (let y = 0; y < PLANET_SIZE.height; y++) {
      const row: GridCellType[] = [];
      for (let x = 0; x < PLANET_SIZE.width; x++) {
        row.push({
          x: x,
          y: y,
          hasRover: x === roverPos.x && y === roverPos.y,
          hasObstacle: obstacles.some(o => o.x === x && o.y === y)
        });
      }
      grid.push(row);
    }
  }
  
  // Cuando se monta el componente, inicializar el rover
  onMount(() => {
    initRover();
  });
  
  // Función para ejecutar comandos
  function executeCommands() {
    if (!commands) return;
    
    const moveResult = rover.executeCommands(commands);
    result = moveResult.message || '';
    
    // Actualizar la cuadrícula
    updateGrid();
    
    // Comunicar el resultado (patrón de webcomponents)
    dispatch('commandExecuted', { 
      success: moveResult.success,
      newPosition: rover.getPosition(),
      message: result
    });
    
    // Limpiar comandos después de ejecutarlos
    commands = '';
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
    rover = new Rover(roverPos.x, roverPos.y, roverPos.direction, PLANET_SIZE, obstacles);
    
    // Actualizar la cuadrícula
    updateGrid();
    
    // Comunicar que se agregó un obstáculo
    dispatch('obstacleAdded', { obstacles });
  }
  
  // Función para limpiar obstáculos
  function clearObstacles() {
    obstacles = [];
    const roverPos = rover.getPosition();
    rover = new Rover(roverPos.x, roverPos.y, roverPos.direction, PLANET_SIZE, []);
    updateGrid();
    
    // Comunicar que se limpiaron los obstáculos
    dispatch('obstaclesCleared');
  }
  
  // Función para reiniciar el rover
  function resetRover() {
    initRover();
    result = '';
    
    // Comunicar que se reinició el rover
    dispatch('roverReset');
  }
</script>

<style>
  /* Panel componentes con estilo consistente */
  .panel {
    background-color: var(--panel-bg, white);
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .panel-title {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
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
  
  .btn-blue {
    background-color: var(--blue-color, #3b82f6);
    color: white;
  }
  
  .btn-yellow {
    background-color: var(--yellow-color, #d97706);
    color: white;
  }
  
  .btn-red {
    background-color: var(--red-color, #dc2626);
    color: white;
  }
  
  .btn-green {
    background-color: var(--green-color, #10b981);
    color: white;
  }
  
</style>

<div class="flex flex-col items-center p-6 space-y-6 w-full">
  <h1 class="text-3xl font-bold text-center">Mars Rover Mission</h1>
  
  <div class="flex flex-row space-x-4 w-full max-w-4xl">
    <!-- Panel de información -->
    <div class="panel flex-1">
      <h2 class="panel-title">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
          <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
        Estado del Rover
      </h2>
      {#if rover}
        <div class="flex items-center mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          <p>Posición: ({rover.getPosition().x}, {rover.getPosition().y})</p>
        </div>
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
          </svg>
          <p>Dirección: {rover.getPosition().direction}</p>
        </div>
      {/if}
    </div>
    
    <!-- Panel de comandos -->
    <div class="panel flex-1">
      <h2 class="panel-title">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122" />
        </svg>
        Comandos
      </h2>
      <p class="mb-2 text-sm">F: Avanzar, L: Girar izquierda, R: Girar derecha</p>
      <div class="flex space-x-2">
        <input 
          type="text" 
          bind:value={commands} 
          placeholder="Ej: FFRLF" 
          class="flex-1 p-2 border rounded"
        />
        <button 
          on:click={executeCommands} 
          class="btn btn-blue"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon mr-1">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
          </svg>
          Enviar
        </button>
      </div>
      
      {#if result}
        <div class="mt-4 p-2 bg-gray-100 dark:bg-gray-700 rounded">
          <p class="flex items-center">
            {#if result.includes('exito')}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon text-green-500">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            {:else}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon text-yellow-500">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            {/if}
            {result}
          </p>
        </div>
      {/if}
    </div>
    
    <!-- Panel de acciones -->
    <div class="panel flex-1">
      <h2 class="panel-title">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
          <path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
        </svg>
        Acciones
      </h2>
      <div class="flex flex-col space-y-2">
        <button 
          on:click={addObstacle} 
          class="btn btn-yellow"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon mr-1">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Agregar Obstáculo
        </button>
        
        <button 
          on:click={clearObstacles} 
          class="btn btn-red"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon mr-1">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
          Limpiar Obstáculos
        </button>
        
        <button 
          on:click={resetRover} 
          class="btn btn-green"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon mr-1">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Reiniciar Rover
        </button>
      </div>
    </div>
  </div>
  <div class="flex flex-col space-y-4 w-full max-w-4xl">

    <!-- Cuadrícula del planeta -->
    {#if rover}
      <RoverGrid 
        grid={grid}
        roverDirection={rover.getPosition().direction}
        roverPosition={{ x: rover.getPosition().x, y: rover.getPosition().y }}
      />
    {/if}
  
    <!-- Instrucciones -->
    <div class="panel w-full">
      <h2 class="panel-title">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
        Instrucciones
      </h2>
      <ul class="list-disc pl-5 space-y-1">
        <li>El rover se mueve en un planeta cuadrado de 20x20.</li>
        <li>El mapa muestra la totalidad del terreno.</li>
        <li>El rover está representado por un icono circular con una flecha que apunta en la dirección actual.</li>
        <li>Ingresa comandos como "FFRLF" para controlar el rover.</li>
        <li><span class="command-key">F</span>: Mover hacia adelante en la dirección actual.</li>
        <li><span class="command-key">L</span>: Girar 90° a la izquierda.</li>
        <li><span class="command-key">R</span>: Girar 90° a la derecha.</li>
        <li>Si el rover encuentra un obstáculo, se detendrá antes de chocar.</li>
      </ul>
    </div>
  </div>
</div> 