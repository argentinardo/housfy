<script lang="ts">
  import type { Direction, Grid } from "./types";
  import GridCell from "./GridCell.svelte";

  export let grid: Grid = [];
  export let roverDirection: Direction;

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
    border: #11aefa 1px solid;
    display: grid;
    border-collapse: collapse;
    gap: 1px;
    background-color: #11aefa;
  }

  .panel {
    background-color: var(--panel-bg, white);
    padding: 16px;
    border-radius: 8px;
  }

  .panel-title {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
  }

</style>
