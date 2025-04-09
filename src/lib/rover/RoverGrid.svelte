<script lang="ts">
  import type { Direction, Position, Grid } from './types';
  import GridCell from './GridCell.svelte';
  
  // Propiedades del componente
  export let grid: Grid = [];
  export let roverDirection: Direction;
  export let roverPosition: Position;
  
  // Título de la cuadrícula
  $: gridTitle = `Mapa Completo - Rover en (${roverPosition.x}, ${roverPosition.y})`;
</script>

<style>
  .grid-container {
    display: grid;
    gap: 1px;
  }
  
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
  
  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    margin-right: 8px;
  }
</style>

<div class="panel w-full">
  <h2 class="panel-title">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
      <path stroke-linecap="round" stroke-linejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
    </svg>
    {gridTitle}
  </h2>
  <div class="grid-container" style="grid-template-columns: repeat({grid[0]?.length || 1}, minmax(0, 1fr));">
    {#each grid as row}
      {#each row as cell}
        <GridCell 
          x={cell.x}
          y={cell.y}
          hasRover={cell.hasRover}
          hasObstacle={cell.hasObstacle}
          roverDirection={cell.hasRover ? roverDirection : undefined}
        />
      {/each}
    {/each}
  </div>
</div> 