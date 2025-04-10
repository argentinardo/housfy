<script lang="ts">
  import type { Direction, Grid } from "./types";
  import GridCell from "./GridCell.svelte";

  // Propiedades del componente
  export let grid: Grid = [];
  export let roverDirection: Direction;

  // Tamaño fijo de la grilla
  const GRID_SIZE = 20;
</script>

<div class="panel w-full">
  <h2 class="panel-title">
    Mapa
  </h2>
  <div
    class="grid-container rounded-md overflow-hidden"
    style="grid-template-columns: repeat({GRID_SIZE}, minmax(0, 1fr));"
  >
    {#each grid as row}
      {#each row as cell}
        <GridCell
          hasRover={cell.hasRover}
          hasObstacle={cell.hasObstacle}
          roverDirection={cell.hasRover ? roverDirection : undefined}
        />
      {/each}
    {/each}
  </div>
</div>

<style>
  .grid-container {
    display: grid;
    border-collapse: collapse;
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
    width: 24px;
    height: 24px;
  }
</style>
